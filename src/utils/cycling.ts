import data from "@/data/cycling.json";
import routeData from "../../public/data/cycling-routes.json";
import type { Locale } from "@/i18n";
import { decodePolyline } from "./polyline.mjs";

/** One ride from src/data/cycling.json: local date, km, elevation gain in m, moving seconds */
export interface Ride {
  d: string;
  km: number;
  m: number;
  s: number;
}

export interface Totals {
  rides: number;
  days: number;
  km: number;
  m: number;
  s: number;
}

export interface YearSummary extends Totals {
  year: number;
  longest: number;
  /** Rides of 100 km or more */
  centuries: number;
  /** Moving average in km/h */
  avgSpeed: number;
  /** Ride counts per length bucket, shortest first */
  buckets: number[];
  /** Distance per length bucket, shortest first */
  bucketKm: number[];
}

export interface CyclingData {
  rides: Ride[];
  years: YearSummary[];
  all: Totals;
  /** Date of the most recent ride: the data's "today" */
  asOf: string;
  /** Calendar year of `asOf` */
  year: number;
  /** Date of the first ride on record */
  first: string;
}

export const LOCALE_TAGS: Record<Locale, string> = { en: "en", zh: "zh-CN", de: "de-DE" };

/** Upper bounds in km of the ride-length buckets, shortest first */
export const LENGTH_BUCKET_MAX = [30, 60, 100, Infinity] as const;
export const BUCKET_COUNT = LENGTH_BUCKET_MAX.length;

export function bucketOf(km: number): number {
  return LENGTH_BUCKET_MAX.findIndex((max) => km < max);
}

const DAY_MS = 86_400_000;

function utcDate(d: string): Date {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/** Zero-based day of the year for a YYYY-MM-DD date */
export function dayIndex(d: string): number {
  const date = utcDate(d);
  return Math.round((date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 1)) / DAY_MS);
}

export function dateAt(year: number, index: number): Date {
  return new Date(Date.UTC(year, 0, 1 + index));
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Monday = 0 … Sunday = 6 */
export function mondayWeekday(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

function totalsOf(rides: Ride[]): Totals {
  return {
    rides: rides.length,
    days: new Set(rides.map((r) => r.d)).size,
    km: rides.reduce((sum, r) => sum + r.km, 0),
    m: rides.reduce((sum, r) => sum + r.m, 0),
    s: rides.reduce((sum, r) => sum + r.s, 0),
  };
}

function summarizeYear(year: number, rides: Ride[]): YearSummary {
  const totals = totalsOf(rides);
  const buckets = new Array<number>(BUCKET_COUNT).fill(0);
  const bucketKm = new Array<number>(BUCKET_COUNT).fill(0);
  for (const ride of rides) {
    const b = bucketOf(ride.km);
    buckets[b]++;
    bucketKm[b] += ride.km;
  }
  return {
    ...totals,
    year,
    longest: Math.max(0, ...rides.map((r) => r.km)),
    centuries: rides.filter((r) => r.km >= 100).length,
    avgSpeed: totals.s ? totals.km / (totals.s / 3600) : 0,
    buckets,
    bucketKm,
  };
}

/** Sums of the rides in `year` up to and including the month-day `monthDay` ("10-20") */
export function totalsThrough(rides: Ride[], year: number, monthDay: string): Totals {
  const prefix = `${year}-`;
  return totalsOf(rides.filter((r) => r.d.startsWith(prefix) && r.d.slice(5) <= monthDay));
}

/** Running distance per day of `year` for the first `days` days; null before `startIndex` */
export function cumulativeKm(
  rides: Ride[],
  year: number,
  days: number,
  startIndex: number
): (number | null)[] {
  const perDay = new Array<number>(days).fill(0);
  for (const ride of rides) {
    if (!ride.d.startsWith(`${year}-`)) continue;
    const i = dayIndex(ride.d);
    if (i < days) perDay[i] += ride.km;
  }
  let sum = 0;
  return perDay.map((km, i) => {
    sum += km;
    return i < startIndex ? null : sum;
  });
}

export interface DayTotal {
  km: number;
  m: number;
  rides: number;
}

export function dailyTotals(rides: Ride[], year: number): Map<string, DayTotal> {
  const days = new Map<string, DayTotal>();
  for (const ride of rides) {
    if (!ride.d.startsWith(`${year}-`)) continue;
    const day = days.get(ride.d) ?? { km: 0, m: 0, rides: 0 };
    day.km += ride.km;
    day.m += ride.m;
    day.rides++;
    days.set(ride.d, day);
  }
  return days;
}

/** Everything the cycling page shows, or null before the first sync */
export function loadCycling(): CyclingData | null {
  const rides: Ride[] = [...data.rides].sort((a, b) => a.d.localeCompare(b.d));
  if (!rides.length) return null;

  const byYear = new Map<number, Ride[]>();
  for (const ride of rides) {
    const year = Number(ride.d.slice(0, 4));
    byYear.set(year, [...(byYear.get(year) ?? []), ride]);
  }
  const asOf = rides[rides.length - 1].d;
  return {
    rides,
    years: [...byYear].map(([year, list]) => summarizeYear(year, list)),
    all: totalsOf(rides),
    asOf,
    year: Number(asOf.slice(0, 4)),
    first: rides[0].d,
  };
}

export function formatNumber(locale: Locale, value: number, digits = 0): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatDate(
  locale: Locale,
  date: Date,
  options: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], { ...options, timeZone: "UTC" }).format(date);
}

/** Round a maximum up to a tidy axis end, using the smallest step that gives six ticks or fewer */
export function niceAxis(
  max: number,
  steps: number[] = [100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000]
): { end: number; step: number } {
  const step = steps.find((s) => max / s <= 6) ?? steps[steps.length - 1];
  return { end: Math.ceil(max / step) * step, step };
}

/** Labels of the ride-length buckets in km, shortest first */
export const BUCKET_LABELS = ["< 30", "30–60", "60–100", "100+"] as const;

const RIDE_WORDS: Record<Locale, [string, string]> = {
  en: ["ride", "rides"],
  zh: ["次", "次"],
  de: ["Ausfahrt", "Ausfahrten"],
};

export function rideUnit(locale: Locale, count: number): string {
  const [one, many] = RIDE_WORDS[locale];
  return count === 1 ? one : many;
}

export function ridesText(locale: Locale, count: number): string {
  return `${formatNumber(locale, count)} ${rideUnit(locale, count)}`;
}

export function climbText(locale: Locale, meters: number): string {
  const n = formatNumber(locale, meters);
  if (locale === "zh") return `爬升 ${n} m`;
  if (locale === "de") return `${n} Hm`;
  return `${n} m climbing`;
}

/** A ride's simplified track: encoded polyline pieces from public/data/cycling-routes.json */
export interface Route {
  d: string;
  km: number;
  p: string[];
}

export function loadRoutes(): Route[] {
  return routeData.routes;
}

/** Routes of rides between two dates (inclusive) that are at least `minKm` long */
export function routesBetween(routes: Route[], from: string, to: string, minKm = 0): Route[] {
  return routes.filter((r) => r.d >= from && r.d <= to && r.km >= minKm);
}

/**
 * SVG path data that draws the given routes as a sketch inside a width × height box,
 * north up and kept in proportion
 */
export function sketchPaths(routes: Route[], width: number, height: number, pad = 10): string[] {
  const pieces = routes.flatMap((r) => r.p.map((p) => decodePolyline(p)));
  const all = pieces.flat();
  if (!all.length) return [];
  const lats = all.map(([lat]) => lat);
  const lons = all.map(([, lon]) => lon);
  const minLat = Math.min(...lats);
  const minLon = Math.min(...lons);
  const midLat = (minLat + Math.max(...lats)) / 2;
  const widthDeg = (Math.max(...lons) - minLon) * Math.cos((midLat * Math.PI) / 180);
  const heightDeg = Math.max(...lats) - minLat;
  const scale = Math.min((width - 2 * pad) / (widthDeg || 1e-6), (height - 2 * pad) / (heightDeg || 1e-6));
  const offsetX = (width - widthDeg * scale) / 2;
  const offsetY = (height - heightDeg * scale) / 2;
  return pieces.map((piece) =>
    piece
      .map(([lat, lon], i) => {
        const x = offsetX + (lon - minLon) * Math.cos((midLat * Math.PI) / 180) * scale;
        const y = height - offsetY - (lat - minLat) * scale;
        return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join("")
  );
}

const EARTH_CIRCUMFERENCE_KM = 40_075;
const EVEREST_M = 8_849;

/** Distance and climbing as playful yardsticks */
export function funFigures(km: number, climbM: number): { aroundEarth: number; everests: number } {
  return {
    aroundEarth: Math.round((km / EARTH_CIRCUMFERENCE_KM) * 100),
    everests: Math.round(climbM / EVEREST_M),
  };
}
