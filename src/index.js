/* @flow */

import type { Bytes, NonboolListEncoding } from "@capnp-js/layout";

import type {
  Byte,
  Pointer,
  SegmentLookup,
  SegmentR,
  SegmentB,
  Word,
} from "@capnp-js/memory";

import type {
  Data as DataR,
  Text as TextR,
  StructValue as StructValueR,
  ArenaR,
  CtorR,
  DataListR,
  ListListR,
  StructListR,
  StructGutsR,
  BoolListGutsR,
  NonboolListGutsR,
  AnyGutsR,
} from "@capnp-js/reader-core";

import type Data from "./Data";
import type Text from "./Text";
import type Orphan from "./Orphan";
import type { StructValue } from "./value";

import type { StructGutsB } from "./guts/struct";
import type { BoolListGutsB } from "./guts/boolList";
import type { NonboolListGutsB } from "./guts/nonboolList";
import type { CapGutsB } from "./guts/cap";

type uint = number;
type u29 = number;
type u30 = number;
type u32 = number;

export type { StructGutsB } from "./guts/struct";
export type { BoolListGutsB } from "./guts/boolList";
export type { NonboolListGutsB } from "./guts/nonboolList";
export type { CapGutsB } from "./guts/cap";

export type AnyGutsB = StructGutsB | BoolListGutsB | NonboolListGutsB | CapGutsB;

export interface ReaderCtor<GUTS: AnyGutsR, R: {+guts: GUTS}> {
  +guts: GUTS;
  reader(Ctor: CtorR<GUTS, R>): R;
}

//TODO: Consider removing `level` from `unref` and `disown` signatures.
export interface CtorB<GUTS: AnyGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>> {
  fromAny(guts: AnyGutsB): B;
  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): B;
  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | B;
  unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<GUTS, R, B>;
  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<GUTS, R, B>;
  validate(p: Pointer<SegmentB>): void;
}

export type WeakStructCtorB<R: {+guts: StructGutsR}, B: ReaderCtor<StructGutsR, R>> = CtorB<StructGutsR, R, B>;
export interface StructCtorB<R: {+guts: StructGutsR}, B: ReaderCtor<StructGutsR, R>> extends CtorB<StructGutsR, R, B> {
  intern(guts: StructGutsB): B;
  compiledBytes(): Bytes;
}
export type WeakListCtorB<GUTS: BoolListGutsR | NonboolListGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>> = CtorB<GUTS, R, B>;
export interface ListCtorB<GUTS: BoolListGutsR | NonboolListGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>> extends CtorB<GUTS, R, B> {
  encoding(): null | NonboolListEncoding;
}

export interface DataListB<T> extends DataListR<T> {
  +guts: BoolListGutsB | NonboolListGutsB;
  set(index: u29 | u30, value: T): void;
  map<U, THIS>(fn: (value: T, index: u29 | u30, list: DataListB<T>) => U, thisArg?: THIS): Array<U>;
  forEach<THIS>(fn: (value: T, index: u29 | u30, list: DataListB<T>) => mixed, thisArg?: THIS): void;
  reduce<U>(fn: (previous: U, current: T, index: u29 | u30, list: DataListB<T>) => U, acc: U): U;
}

export interface StructListB<R: {+guts: StructGutsR}, B: ReaderCtor<StructGutsR, R>> extends StructListR<B>, ReaderCtor<NonboolListGutsR, StructListR<R>> {
  +guts: NonboolListGutsB;
  setWithCaveats(index: u29 | u30, value: R | B): void;
  map<T, THIS>(fn: (value: B, index: u29 | u30, list: StructListB<R, B>) => T, thisArg?: THIS): Array<T>;
  forEach<THIS>(fn: (value: B, index: u29 | u30, list: StructListB<R, B>) => mixed, thisArg?: THIS): void;
  reduce<T>(fn: (previous: T, current: B, index: u29 | u30, list: StructListB<R, B>) => T, acc: T): T;
}

export type StructListCtorB<R: {+guts: StructGutsR}, B: ReaderCtor<StructGutsR, R>> = ListCtorB<NonboolListGutsR, StructListR<R>, StructListB<R, B>>;

export interface ListListB<GUTS: BoolListGutsR | NonboolListGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>> extends ListListR<GUTS, B>, ReaderCtor<NonboolListGutsR, ListListR<GUTS, R>> {
  +guts: NonboolListGutsB;
  set(index: u29 | u30, value: R | B): void;
  disown(index: u29 | u30): null | Orphan<GUTS, R, B>;
  adopt(index: u29 | u30, value: Orphan<GUTS, R, B>): void;
  map<T, THIS>(fn: (value: null | B, index: u29 | u30, list: ListListB<GUTS, R, B>) => T, thisArg?: THIS): Array<T>;
  forEach<THIS>(fn: (value: null | B, index: u29 | u30, list: ListListB<GUTS, R, B>) => mixed, thisArg?: THIS): void;
  reduce<T>(fn: (previous: T, current: null | B, index: u29 | u30, list: ListListB<GUTS, R, B>) => T, acc: T): T;
}

export type ListListCtorB<GUTS: BoolListGutsR | NonboolListGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>> = ListCtorB<NonboolListGutsR, ListListR<GUTS, R>, ListListB<GUTS, R, B>>;

export interface ArenaB extends SegmentLookup<SegmentB>, ArenaR {
  /* I explicitly repeat the `segment` method because the extends clause of this
     interface is order sensitive and I want to be unambiguous. */
  segment(id: u32): SegmentB;
  pointer(ref: Word<SegmentR>): Pointer<SegmentB>;

  /* Allocate `length` word-aligned bytes. The allocated bytes begin at the
     returned `Word<Segment>`. */
  allocate(length: uint, bias?: SegmentB): Word<SegmentB>;

  /* Try to allocate `length` word-aligned bytes on `local` segment. If that
     allocation fails, then allocate `8 + length` word-aligned bytes on some
     other segment. The returned `Word<Segment>` references the start of
     `length` word-aligned bytes. If the local allocation failed, then the
     returned `Word<Segment>` is preceded by a single word. This word is
     intended for use as a landing pad for a single-hop far pointer. Note that
     the return type isn't actually a `Word<Segment>`, but it is castable to
     `Word<Segment>`--the distinction is `position`'s mutability which may save
     an object literal or two. */
  preallocate(length: uint, local: SegmentB): Word<SegmentB>;

  /* Write `length` bytes beginning from `source` to `target`. */
  write(source: Byte<SegmentR>, length: uint, target: Byte<SegmentB>): void;

  /* Zero `length` bytes beginning at `start`. */
  zero(begin: Byte<SegmentB>, length: uint): void;
}

export interface UserArenaB {
  initRoot<R: {+guts: StructGutsR}, B: ReaderCtor<StructGutsR, R>>(Ctor: StructCtorB<R, B>): B;
  getRoot(): null | StructValue;
  setRoot(value: StructValueR | StructValue): void;
  disownRoot(): null | Orphan<StructGutsR, StructValueR, StructValue>;
  adoptRoot(orphan: Orphan<StructGutsR, StructValueR, StructValue>): void;

  initStruct<R: {+guts: StructGutsR}, B: ReaderCtor<StructGutsR, R>>(
    Ctor: StructCtorB<R, B>,
    bias?: SegmentB, //TODO: using a segment id here seems safer. The implementation probably just uses the segment id, but shouldn't it error if the segment belongs to another arena?
  ): Orphan<StructGutsR, R, B>;

  initList<GUTS: BoolListGutsR | NonboolListGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>>(
    Ctor: ListCtorB<GUTS, R, B>,
    length: u29 | u30,
    bias?: SegmentB,
  ): Orphan<GUTS, R, B>;

  initText(
    ucs2: string,
    bias?: SegmentB,
  ): Orphan<NonboolListGutsR, TextR, Text>;

  initData(
    length: u29,
    bias?: SegmentB,
  ): Orphan<NonboolListGutsR, DataR, Data>;
}

export { AnyValue, StructValue, ListValue } from "./value";
export { RefedStruct } from "./guts/struct";
export { RefedBoolList } from "./guts/boolList";
export { RefedNonboolList } from "./guts/nonboolList";
export * from "./list";
export { default as Orphan } from "./Orphan";
export { default as Data } from "./Data";
export { default as Text } from "./Text";
export { default as initStruct } from "./initStruct";
