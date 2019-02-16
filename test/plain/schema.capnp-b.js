/* @flow */

import type { Int64 } from "@capnp-js/int64";
import type { UInt64 } from "@capnp-js/uint64";
import type { Bytes } from "@capnp-js/layout";
import type { Pointer, SegmentB, Word } from "@capnp-js/memory";
import type {
  CtorR,
  StructGutsR,
  BoolListGutsR,
  NonboolListGutsR,
  StructListR,
  PointerListR,
  Data as DataR,
  Text as TextR,
  VoidList as VoidListR,
  BoolList as BoolListR,
  Int8List as Int8ListR,
  Int16List as Int16ListR,
  Int32List as Int32ListR,
  Int64List as Int64ListR,
  UInt8List as UInt8ListR,
  UInt16List as UInt16ListR,
  UInt32List as UInt32ListR,
  UInt64List as UInt64ListR,
  Float32List as Float32ListR,
  Float64List as Float64ListR,
} from "@capnp-js/reader-core";
import type {
  ArenaB,
  AnyGutsB,
  StructGutsB,
  StructCtorB,
  StructListB,
  PointerListB,
} from "@capnp-js/builder-core";

import type {
  Leaves__InstanceR,
  Lists__InstanceR,
  Nesteds__InstanceR,
} from "./schema.capnp-r";

import * as decode from "@capnp-js/read-data";
import * as encode from "@capnp-js/write-data";
import { inject as injectI64 } from "@capnp-js/int64";
import { inject as injectU64 } from "@capnp-js/uint64";
import { isNull } from "@capnp-js/memory";
import {
  RefedStruct,
  Orphan,
  Data,
  Text,
  VoidList,
  BoolList,
  Int8List,
  Int16List,
  Int32List,
  Int64List,
  UInt8List,
  UInt16List,
  UInt32List,
  UInt64List,
  Float32List,
  Float64List,
  structs,
  pointers,
} from "@capnp-js/builder-core";

type uint = number;
type i8 = number;
type i16 = number;
type i32 = number;
type u8 = number;
type u16 = number;
type u32 = number;
type f32 = number;
type f64 = number;

/**********/
/* Leaves */
/**********/

export class Leaves__CtorB implements StructCtorB<Leaves__InstanceR, Leaves__InstanceB> {
  fromAny(guts: AnyGutsB): Leaves__InstanceB {
    return new Leaves__InstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Leaves__InstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new Leaves__InstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Leaves__InstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<StructGutsR, Leaves__InstanceR, Leaves__InstanceB> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, Leaves__InstanceR, Leaves__InstanceB> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  validate(p: Pointer<SegmentB>): void {
    RefedStruct.validate(p, this.compiledBytes());
  }

  intern(guts: StructGutsB): Leaves__InstanceB {
    return new Leaves__InstanceB(guts);
  }

  compiledBytes(): Bytes {
    return { data: 48, pointers: 32 };
  }
}

export class Leaves__InstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<StructGutsR, Leaves__InstanceR>): Leaves__InstanceR {
    return Ctor.intern(this.guts);
  }

  /* void */
  getVoid(): void {}
  setVoid(): void {}

  /* bool */
  getBool(): boolean {
    const d = this.guts.layout.dataSection + 0;
    // 0 => true
    // 1 => false
    // Pattern: Single bang for true default, double bang for false default. Right?
    return !decode.bit(this.guts.segment.raw, d, 0x00);
  }
  setBool(value: boolean): void {
    const d = this.guts.layout.dataSection + 0;
    // Pattern: Single bang for true default, no bang for false default. Right?
    encode.bit(!value, this.guts.segment.raw, d, 0x00);
  }

  /* uint8 */
  getUint8(): u8 {
    const d = this.guts.layout.dataSection + 1;
    return (253 ^ decode.uint8(this.guts.segment.raw, d)) >>> 0;
  }
  setUint8(value: u8): void {
    const d = this.guts.layout.dataSection + 1;
    encode.uint8(253 ^ value, this.guts.segment.raw, d);
  }

  /* uint16 */
  getUint16(): u16 {
    const d = this.guts.layout.dataSection + 2;
    return (65531 ^ decode.uint16(this.guts.segment.raw, d)) >>> 0;
  }
  setUint16(value: u16): void {
    const d = this.guts.layout.dataSection + 2;
    encode.uint16(65531 ^ value, this.guts.segment.raw, d);
  }

  /* uint32 */
  getUint32(): u32 {
    const d = this.guts.layout.dataSection + 4;
    return (4294967123 ^ decode.int32(this.guts.segment.raw, d)) >>> 0;
  }
  setUint32(value: u32): void {
    const d = this.guts.layout.dataSection + 4;
    encode.int32(4294967123 ^ value, this.guts.segment.raw, d);
  }

  /* uint64 */
  getUint64(): UInt64 {
    const d = this.guts.layout.dataSection + 8;
    const raw = this.guts.segment.raw;
    return injectU64(
      4294967295 ^ decode.int32(raw, d+4),
      4294967282 ^ decode.int32(raw, d),
    );
  }
  setUint64(value: UInt64) {
    const d = this.guts.layout.dataSection + 8;
    encode.int32(4294967295 ^ value[0], this.guts.segment.raw, d+4);
    encode.int32(4294967282 ^ value[1], this.guts.segment.raw, d);
  }

  /* int8 */
  getInt8(): i8 {
    const d = this.guts.layout.dataSection + 16;
    return -119 ^ decode.int8(this.guts.segment.raw, d);
  }
  setInt8(value: i8): void {
    const d = this.guts.layout.dataSection + 16;
    encode.int8(-119 ^ value, this.guts.segment.raw, d);
  }

  /* int16 */
  getInt16(): i16 {
    const d = this.guts.layout.dataSection + 18;
    return -32612 ^ decode.int16(this.guts.segment.raw, d);
  }
  setInt16(value: i16): void {
    const d = this.guts.layout.dataSection + 18;
    encode.int16(-32612 ^ value, this.guts.segment.raw, d);
  }

  /* int32 */
  getInt32(): i32 {
    const d = this.guts.layout.dataSection + 20;
    return -2147483102 ^ decode.int32(this.guts.segment.raw, d);
  }
  setInt32(value: i32): void {
    const d = this.guts.layout.dataSection + 20;
    encode.int32(-2147483102 ^ value, this.guts.segment.raw, d);
  }

  /* int64 */
  getInt64(): Int64 {
    const d = this.guts.layout.dataSection + 24;
    return injectI64(
      -2147483648 ^ decode.int32(this.guts.segment.raw, d+4),
      -96 ^ decode.int32(this.guts.segment.raw, d),
    );
  }
  setInt64(value: Int64): void {
    const d = this.guts.layout.dataSection + 24;
    encode.int32(-2147483648 ^ value[0], this.guts.segment.raw, d+4);
    encode.int32(-96 ^ value[1], this.guts.segment.raw, d);
  }

  /* float32 */
  getFloat32(): f32 {
    const d = this.guts.layout.dataSection + 32;
    return decode.float32(123 ^ decode.int32(this.guts.segment.raw, d));
  }
  setFloat32(value: f32): void {
    const d = this.guts.layout.dataSection + 32;
    encode.int32(123 ^ encode.float32(value), this.guts.segment.raw, d);
  }

  /* float64 */
  getFloat64(): f64 {
    const d = this.guts.layout.dataSection + 36;
    const bytes = injectI64(
      123 ^ decode.int32(this.guts.segment.raw, d+4),
      123 ^ decode.int32(this.guts.segment.raw, d)
    );
    return decode.float64(bytes);
  }
  setFloat64(value: f64): void {
    const d = this.guts.layout.dataSection + 36;
    const bytes = encode.float64(value);
    encode.int32(123 ^ bytes[0], this.guts.segment.raw, d+4);
    encode.int32(123 ^ bytes[1], this.guts.segment.raw, d);
  }

  /* data */
  getData(): null | Data {
    const ref = this.guts.pointersWord(0);
    return Data.get(this.guts.level, this.guts.arena, ref);
  }
  setData(value: DataR | Data): void {
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownData(): null | Orphan<NonboolListGutsR, DataR, Data> {
    const ref = this.guts.pointersWord(0);
    return Data.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptData(orphan: Orphan<NonboolListGutsR, DataR, Data>): void {
    const ref = this.guts.pointersWord(0);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* text */
  getText(): null | Text {
    const ref = this.guts.pointersWord(8);
    return Text.get(this.guts.level, this.guts.arena, ref);
  }
  setText(value: TextR | Text): void {
    const ref = this.guts.pointersWord(8);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownText(): null | Orphan<NonboolListGutsR, TextR, Text> {
    const ref = this.guts.pointersWord(8);
    return Text.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptText(orphan: Orphan<NonboolListGutsR, TextR, Text>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

/*********/
/* Lists */
/*********/

export class Lists__CtorB implements StructCtorB<Lists__InstanceR, Lists__InstanceB> {
  fromAny(guts: AnyGutsB): Lists__InstanceB {
    return new Lists__InstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Lists__InstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new Lists__InstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Lists__InstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<StructGutsR, Lists__InstanceR, Lists__InstanceB> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, Lists__InstanceR, Lists__InstanceB> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  validate(p: Pointer<SegmentB>): void {
    RefedStruct.validate(p, this.compiledBytes());
  }

  intern(guts: StructGutsB): Lists__InstanceB {
    return new Lists__InstanceB(guts);
  }

  compiledBytes(): Bytes {
    return { data: 48, pointers: 32 };
  }
}

export class Lists__InstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<StructGutsR, Lists__InstanceR>): Lists__InstanceR {
    return Ctor.intern(this.guts);
  }

  /* voidList */
  getVoidList(): null | VoidList {
    const ref = this.guts.pointersWord(0);
    return VoidList.get(this.guts.level, this.guts.arena, ref);
  }
  setVoidList(value: VoidListR | VoidList): void {
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownVoidList(): null | Orphan<NonboolListGutsR, VoidListR, VoidList> {
    const ref = this.guts.pointersWord(0);
    return VoidList.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptVoidList(orphan: Orphan<NonboolListGutsR, VoidListR, VoidList>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* boolList */
  getBoolList(): null | BoolList {
    const ref = this.guts.pointersWord(8);
    return BoolList.get(this.guts.level, this.guts.arena, ref);
  }
  setBoolList(value: BoolListR | BoolList): void {
    const ref = this.guts.pointersWord(8);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownBoolList(): null | Orphan<BoolListGutsR, BoolListR, BoolList> {
    const ref = this.guts.pointersWord(8);
    return BoolList.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptBoolList(orphan: Orphan<BoolListGutsR, BoolListR, BoolList>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* uint8List */
  getUint8List(): null | UInt8List {
    const ref = this.guts.pointersWord(16);
    return UInt8List.get(this.guts.level, this.guts.arena, ref);
  }
  setUint8List(value: UInt8ListR | UInt8List): void {
    const ref = this.guts.pointersWord(16);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownUint8List(): null | Orphan<NonboolListGutsR, UInt8ListR, UInt8List> {
    const ref = this.guts.pointersWord(16);
    return UInt8List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptUint8List(orphan: Orphan<NonboolListGutsR, UInt8ListR, UInt8List>): void {
    const ref = this.guts.pointersWord(16);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* uint16List */
  getUint16List(): null | UInt16List {
    const ref = this.guts.pointersWord(24);
    return UInt16List.get(this.guts.level, this.guts.arena, ref);
  }
  setUint16List(value: UInt16ListR | UInt16List): void {
    const ref = this.guts.pointersWord(24);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownUint16List(): null | Orphan<NonboolListGutsR, UInt16ListR, UInt16List> {
    const ref = this.guts.pointersWord(24);
    return UInt16List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptUint16List(orphan: Orphan<NonboolListGutsR, UInt16ListR, UInt16List>): void {
    const ref = this.guts.pointersWord(24);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* uint32List */
  getUint32List(): null | UInt32List {
    const ref = this.guts.pointersWord(32);
    return UInt32List.get(this.guts.level, this.guts.arena, ref);
  }
  setUint32List(value: UInt32ListR | UInt32List): void {
    const ref = this.guts.pointersWord(32);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownUint32List(): null | Orphan<NonboolListGutsR, UInt32ListR, UInt32List> {
    const ref = this.guts.pointersWord(32);
    return UInt32List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptUint32List(orphan: Orphan<NonboolListGutsR, UInt32ListR, UInt32List>): void {
    const ref = this.guts.pointersWord(32);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* uint64List */
  getUint64List(): null | UInt64List {
    const ref = this.guts.pointersWord(40);
    return UInt64List.get(this.guts.level, this.guts.arena, ref);
  }
  setUint64List(value: UInt64ListR | UInt64List): void {
    const ref = this.guts.pointersWord(40);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownUint64List(): null | Orphan<NonboolListGutsR, UInt64ListR, UInt64List> {
    const ref = this.guts.pointersWord(40);
    return UInt64List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptUint64List(orphan: Orphan<NonboolListGutsR, UInt64ListR, UInt64List>): void {
    const ref = this.guts.pointersWord(40);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* int8List */
  getInt8List(): null | Int8List {
    const ref = this.guts.pointersWord(48);
    return Int8List.get(this.guts.level, this.guts.arena, ref);
  }
  setInt8List(value: Int8ListR | Int8List): void {
    const ref = this.guts.pointersWord(48);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownInt8List(): null | Orphan<NonboolListGutsR, Int8ListR, Int8List> {
    const ref = this.guts.pointersWord(48);
    return Int8List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptInt8List(orphan: Orphan<NonboolListGutsR, Int8ListR, Int8List>): void {
    const ref = this.guts.pointersWord(48);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* int16List */
  getInt16List(): null | Int16List {
    const ref = this.guts.pointersWord(56);
    return Int16List.get(this.guts.level, this.guts.arena, ref);
  }
  setInt16List(value: Int16ListR | Int16List): void {
    const ref = this.guts.pointersWord(56);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownInt16List(): null | Orphan<NonboolListGutsR, Int16ListR, Int16List> {
    const ref = this.guts.pointersWord(56);
    return Int16List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptInt16List(orphan: Orphan<NonboolListGutsR, Int16ListR, Int16List>): void {
    const ref = this.guts.pointersWord(56);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* int32List */
  getInt32List(): null | Int32List {
    const ref = this.guts.pointersWord(64);
    return Int32List.get(this.guts.level, this.guts.arena, ref);
  }
  setInt32List(value: Int32ListR | Int32List): void {
    const ref = this.guts.pointersWord(64);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownInt32List(): null | Orphan<NonboolListGutsR, Int32ListR, Int32List> {
    const ref = this.guts.pointersWord(64);
    return Int32List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptInt32List(orphan: Orphan<NonboolListGutsR, Int32ListR, Int32List>): void {
    const ref = this.guts.pointersWord(64);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* int64List */
  getInt64List(): null | Int64List {
    const ref = this.guts.pointersWord(72);
    return Int64List.get(this.guts.level, this.guts.arena, ref);
  }
  setInt64List(value: Int64ListR | Int64List): void {
    const ref = this.guts.pointersWord(72);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownInt64List(): null | Orphan<NonboolListGutsR, Int64ListR, Int64List> {
    const ref = this.guts.pointersWord(72);
    return Int64List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptInt64List(orphan: Orphan<NonboolListGutsR, Int64ListR, Int64List>): void {
    const ref = this.guts.pointersWord(72);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* float32List */
  getFloat32List(): null | Float32List {
    const ref = this.guts.pointersWord(80);
    return Float32List.get(this.guts.level, this.guts.arena, ref);
  }
  setFloat32List(value: Float32ListR | Float32List): void {
    const ref = this.guts.pointersWord(80);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownFloat32List(): null | Orphan<NonboolListGutsR, Float32ListR, Float32List> {
    const ref = this.guts.pointersWord(80);
    return Float32List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptFloat32List(orphan: Orphan<NonboolListGutsR, Float32ListR, Float32List>): void {
    const ref = this.guts.pointersWord(80);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* float64List */
  getFloat64List(): null | Float64List {
    const ref = this.guts.pointersWord(88);
    return Float64List.get(this.guts.level, this.guts.arena, ref);
  }
  setFloat64List(value: Float64ListR | Float64List): void {
    const ref = this.guts.pointersWord(88);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownFloat64List(): null | Orphan<NonboolListGutsR, Float64ListR, Float64List> {
    const ref = this.guts.pointersWord(88);
    return Float64List.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptFloat64List(orphan: Orphan<NonboolListGutsR, Float64ListR, Float64List>): void {
    const ref = this.guts.pointersWord(88);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* dataList */
  getDataList(): null | PointerListB<NonboolListGutsR, DataR, Data> {
    const ref = this.guts.pointersWord(96);
    return pointers(Data).get(this.guts.level, this.guts.arena, ref);
  }
  setDataList(value: PointerListR<NonboolListGutsR, DataR> | PointerListB<NonboolListGutsR, DataR, Data>): void {
    const ref = this.guts.pointersWord(96);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownDataList(): null | Orphan<NonboolListGutsR, PointerListR<NonboolListGutsR, DataR>, PointerListB<NonboolListGutsR, DataR, Data>> {
    const ref = this.guts.pointersWord(96);
    return pointers(Data).disown(this.guts.level, this.guts.arena, ref);
  }
  adoptDataList(orphan: Orphan<NonboolListGutsR, PointerListR<NonboolListGutsR, DataR>, PointerListB<NonboolListGutsR, DataR, Data>>): void {
    const ref = this.guts.pointersWord(96);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* textList */
  getTextList(): null | PointerListB<NonboolListGutsR, TextR, Text> {
    const ref = this.guts.pointersWord(104);
    return pointers(Text).get(this.guts.level, this.guts.arena, ref);
  }
  setTextList(value: PointerListR<NonboolListGutsR, TextR> | PointerListB<NonboolListGutsR, TextR, Text>): void {
    const ref = this.guts.pointersWord(104);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownTextList(): null | Orphan<NonboolListGutsR, PointerListR<NonboolListGutsR, TextR>, PointerListB<NonboolListGutsR, TextR, Text>> {
    const ref = this.guts.pointersWord(104);
    return pointers(Text).disown(this.guts.level, this.guts.arena, ref);
  }
  adoptTextList(orphan: Orphan<NonboolListGutsR, PointerListR<NonboolListGutsR, TextR>, PointerListB<NonboolListGutsR, TextR, Text>>): void {
    const ref = this.guts.pointersWord(104);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

/***********/
/* Nesteds */
/***********/

export class Nesteds__CtorB implements StructCtorB<Nesteds__InstanceR, Nesteds__InstanceB> {
  fromAny(guts: AnyGutsB): Nesteds__InstanceB {
    return new Nesteds__InstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Nesteds__InstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new Nesteds__InstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Nesteds__InstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<StructGutsR, Nesteds__InstanceR, Nesteds__InstanceB> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, Nesteds__InstanceR, Nesteds__InstanceB> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  validate(p: Pointer<SegmentB>): void {
    RefedStruct.validate(p, this.compiledBytes());
  }

  intern(guts: StructGutsB): Nesteds__InstanceB {
    return new Nesteds__InstanceB(guts);
  }

  compiledBytes(): Bytes {
    return { data: 48, pointers: 32 };
  }
}

export class Nesteds__InstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<StructGutsR, Nesteds__InstanceR>): Nesteds__InstanceR {
    return Ctor.intern(this.guts);
  }

  /* leaves */
  getLeaves(): null | Leaves__InstanceB {
    const ref = this.guts.pointersWord(0);
    return Leaves.get(this.guts.level, this.guts.arena, ref);
  }
  setLeaves(value: Leaves__InstanceR | Leaves__InstanceB): void {
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownLeaves(): null | Orphan<StructGutsR, Leaves__InstanceR, Leaves__InstanceB> {
    const ref = this.guts.pointersWord(0);
    return Leaves.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptLeaves(orphan: Orphan<StructGutsR, Leaves__InstanceR, Leaves__InstanceB>): void {
    const ref = this.guts.pointersWord(0);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* leavesList */
  getLeavesList(): null | StructListB<Leaves__InstanceR, Leaves__InstanceB> {
    const ref = this.guts.pointersWord(8);
    return structs(Leaves).get(this.guts.level, this.guts.arena, ref);
  }
  setLeavesList(value: StructListR<Leaves__InstanceR> | StructListB<Leaves__InstanceR, Leaves__InstanceB>): void {
    const ref = this.guts.pointersWord(8);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownLeavesList(): null | Orphan<NonboolListGutsR, StructListR<Leaves__InstanceR>, StructListB<Leaves__InstanceR, Leaves__InstanceB>> {
    const ref = this.guts.pointersWord(8);
    return structs(Leaves).disown(this.guts.level, this.guts.arena, ref);
  }
  adoptLeavesList(orphan: Orphan<NonboolListGutsR, StructListR<Leaves__InstanceR>, StructListB<Leaves__InstanceR, Leaves__InstanceB>>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* leavesListList */
  getLeavesListList(): null | PointerListB<NonboolListGutsR, StructListR<Leaves__InstanceR>, StructListB<Leaves__InstanceR, Leaves__InstanceB>> {
    const ref = this.guts.pointersWord(16);
    return pointers(structs(Leaves)).get(this.guts.level, this.guts.arena, ref);
  }
  setLeavesListList(value: PointerListR<NonboolListGutsR, StructListR<Leaves__InstanceR>> | PointerListB<NonboolListGutsR, StructListR<Leaves__InstanceR>, StructListB<Leaves__InstanceR, Leaves__InstanceB>>): void {
    const ref = this.guts.pointersWord(16);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownLeavesListList(): null | Orphan<NonboolListGutsR, PointerListR<NonboolListGutsR, StructListR<Leaves__InstanceR>>, PointerListB<NonboolListGutsR, StructListR<Leaves__InstanceR>, StructListB<Leaves__InstanceR, Leaves__InstanceB>>> {
    const ref = this.guts.pointersWord(16);
    return pointers(structs(Leaves)).disown(this.guts.level, this.guts.arena, ref);
  }
  adoptLeavesListList(orphan: Orphan<NonboolListGutsR, PointerListR<NonboolListGutsR, StructListR<Leaves__InstanceR>>, PointerListB<NonboolListGutsR, StructListR<Leaves__InstanceR>, StructListB<Leaves__InstanceR, Leaves__InstanceB>>>): void {
    const ref = this.guts.pointersWord(16);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* lists */
  getLists(): null | Lists__InstanceB {
    const ref = this.guts.pointersWord(24);
    return Lists.get(this.guts.level, this.guts.arena, ref);
  }
  setLists(value: Lists__InstanceR | Lists__InstanceB): void {
    const ref = this.guts.pointersWord(24);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownLists(): null | Orphan<StructGutsR, Lists__InstanceR, Lists__InstanceB> {
    const ref = this.guts.pointersWord(24);
    return Lists.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptLists(orphan: Orphan<StructGutsR, Lists__InstanceR, Lists__InstanceB>): void {
    const ref = this.guts.pointersWord(24);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* listsList */
  getListsList(): null | StructListB<Lists__InstanceR, Lists__InstanceB> {
    const ref = this.guts.pointersWord(32);
    return structs(Lists).get(this.guts.level, this.guts.arena, ref);
  }
  setListsList(value: StructListR<Lists__InstanceR> | StructListB<Lists__InstanceR, Lists__InstanceB>): void { 
   const ref = this.guts.pointersWord(32);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownListsList(): null | Orphan<NonboolListGutsR, StructListR<Lists__InstanceR>, StructListB<Lists__InstanceR, Lists__InstanceB>> {
    const ref = this.guts.pointersWord(32);
    return structs(Lists).disown(this.guts.level, this.guts.arena, ref);
  }
  adoptListsList(orphan: Orphan<NonboolListGutsR, StructListR<Lists__InstanceR>, StructListB<Lists__InstanceR, Lists__InstanceB>>): void {
    const ref = this.guts.pointersWord(32);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* listsListList */
  getListsListList(): null | PointerListB<NonboolListGutsR, StructListR<Lists__InstanceR>, StructListB<Lists__InstanceR, Lists__InstanceB>> {
    const ref = this.guts.pointersWord(40);
    return pointers(structs(Lists)).get(this.guts.level, this.guts.arena, ref);
  }
  setListsListList(value: PointerListR<NonboolListGutsR, StructListR<Lists__InstanceR>> | PointerListB<NonboolListGutsR, StructListR<Lists__InstanceR>, StructListB<Lists__InstanceR, Lists__InstanceB>>): void {
    const ref = this.guts.pointersWord(40);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownListsListList(): null | Orphan<NonboolListGutsR, PointerListR<NonboolListGutsR, StructListR<Lists__InstanceR>>, PointerListB<NonboolListGutsR, StructListR<Lists__InstanceR>, StructListB<Lists__InstanceR, Lists__InstanceB>>> {
    const ref = this.guts.pointersWord(40);
    return pointers(structs(Lists)).disown(this.guts.level, this.guts.arena, ref);
  }
  adoptListsListList(orphan: Orphan<NonboolListGutsR, PointerListR<NonboolListGutsR, StructListR<Lists__InstanceR>>, PointerListB<NonboolListGutsR, StructListR<Lists__InstanceR>, StructListB<Lists__InstanceR, Lists__InstanceB>>>): void {
    const ref = this.guts.pointersWord(40);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

export const Leaves = new Leaves__CtorB();
export const Lists = new Lists__CtorB();
export const Nesteds = new Nesteds__CtorB();
