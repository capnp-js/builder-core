/* @flow */

//TODO: Smart enough name collision handling to mangle these types in the case of collisions?
import type { Int64 } from "@capnp-js/int64";
import type { UInt64 } from "@capnp-js/uint64";
import type { Bytes } from "@capnp-js/layout";
import type { Pointer, SegmentR, SegmentB, Word } from "@capnp-js/memory";
import type {
  ArenaR,
  StructCtorR,
  StructListR,
  PointerListR,
  AnyGutsR,
  StructGutsR,
  BoolListGutsR,
  NonboolListGutsR
} from "@capnp-js/reader-core";

import { isNull } from "@capnp-js/memory";
import * as decode from "@capnp-js/read-data";
import * as encode from "@capnp-js/write-data";
import { deserializeUnsafe } from "@capnp-js/reader-arena";
import { inject as injectI64 } from "@capnp-js/int64";
import { inject as injectU64 } from "@capnp-js/uint64";
import {
  RefedStruct,
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
  pointers,
  structs,
} from "@capnp-js/reader-core";

type uint = number;
type i8 = number;
type i16 = number;
type i32 = number;
type u8 = number;
type u16 = number;
type u32 = number;
type f32 = number;
type f64 = number;

const blob = deserializeUnsafe("EAEAAA");

const defaults = {
  "0xd432bf707603c523": {
    data: {
      segment: 0,
      position: 0,
    },
    text: {
      segment: 0,
      position: 0,
    },
  },
  "0x87c1c2a58b6ddc27": {
    voidList: {
      segment: 0,
      position: 0,
    },
    boolList: {
      segment: 0,
      position: 0,
    },
    uint8List: {
      segment: 0,
      position: 0,
    },
    uint16List: {
      segment: 0,
      position: 0,
    },
    uint32List: {
      segment: 0,
      position: 0,
    },
    uint64List: {
      segment: 0,
      position: 0,
    },
    int8List: {
      segment: 0,
      position: 0,
    },
    int16List: {
      segment: 0,
      position: 0,
    },
    int32List: {
      segment: 0,
      position: 0,
    },
    int64List: {
      segment: 0,
      position: 0,
    },
    float32List: {
      segment: 0,
      position: 0,
    },
    float64List: {
      segment: 0,
      position: 0,
    },
    dataList: {
      segment: 0,
      position: 0,
    },
    textList: {
      segment: 0,
      position: 0,
    },
  },
  "0xce8354878bc98e17": {
    leaves: {
      segment: 0,
      position: 0,
    },
    leavesList: {
      segment: 0,
      position: 0,
    },
    lists: {
      segment: 0,
      position: 0,
    },
    listsList: {
      segment: 0,
      position: 0,
    },
  },
};

/**********/
/* Leaves */
/**********/

export class Leaves__CtorR implements StructCtorR<Leaves__InstanceR> {
  intern(guts: StructGutsR): Leaves__InstanceR {
    return new Leaves__InstanceR(guts);
  }

  fromAny(guts: AnyGutsR): Leaves__InstanceR {
    return new Leaves__InstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): Leaves__InstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new Leaves__InstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | Leaves__InstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 48, pointers: 32 };
  }

  empty(): Leaves__InstanceR {
    const guts = RefedStruct.empty(blob);
    return new Leaves__InstanceR(guts);
  }

  /* Defaults */
  defaultData(): Data {
    const meta = defaults["0xd432bf707603c523"].data;
    return Data.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultText(): Text {
    const meta = defaults["0xd432bf707603c523"].text;
    return Text.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
}

export class Leaves__InstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }

  /* void */
  getVoid(): void {}

  /* bool */
  getBool(): boolean {
    const d = this.guts.layout.dataSection;
    // 0 => true
    // 1 => false
    if (d < this.guts.layout.pointersSection) {
      // Pattern: Single bang for true default, double bang for false default. Right?
      return !decode.bit(this.guts.segment.raw, d, 0x00);
    } else {
      return true;
    }
  }

  /* uint8 */
  getUint8(): u8 {
    const d = this.guts.layout.dataSection + 1;
    //TODO: There exists some logic that could avoid the `d+1`, but that seems
    //      silly to optimize away.
    if (d + 1 <= this.guts.layout.pointersSection) {
      return (253 ^ decode.uint8(this.guts.segment.raw, d)) >>> 0;
    } else {
      return 253;
    }
  }

  /* uint16 */
  getUint16(): u16 {
    const d = this.guts.layout.dataSection + 2;
    if (d + 2 <= this.guts.layout.pointersSection) {
      return (65531 ^ decode.uint16(this.guts.segment.raw, d)) >>> 0;
    } else {
      return 65531;
    }
  }

  /* uint32 */
  getUint32(): u32 {
    const d = this.guts.layout.dataSection + 4;
    if (d + 4 <= this.guts.layout.pointersSection) {
      return (4294967123 ^ decode.int32(this.guts.segment.raw, d)) >>> 0;
    } else {
      return 4294967123;
    }
  }

  /* uint64 */
  getUint64(): UInt64 {
    const d = this.guts.layout.dataSection + 8;
    if (d + 8 <= this.guts.layout.pointersSection) {
      return injectU64(
        4294967295 ^ decode.int32(this.guts.segment.raw, d+4),
        4294967282 ^ decode.int32(this.guts.segment.raw, d),
      );
    } else {
      return injectU64(4294967295, 4294967282);
    }
  }

  /* int8 */
  getInt8(): i8 {
    const d = this.guts.layout.dataSection + 16;
    if (d + 1 <= this.guts.layout.pointersSection) {
      return -119 ^ decode.int8(this.guts.segment.raw, d);
    } else {
      return -119;
    }
  }

  /* int16 */
  getInt16(): i16 {
    const d = this.guts.layout.dataSection + 18;
    if (d + 2 <= this.guts.layout.pointersSection) {
      return -32612 ^ decode.int16(this.guts.segment.raw, d);
    } else {
      return -32612;
    }
  }

  /* int32 */
  getInt32(): i32 {
    const d = this.guts.layout.dataSection + 20;
    if (d + 4 <= this.guts.layout.pointersSection) {
      return -2147483102 ^ decode.int32(this.guts.segment.raw, d);
    } else {
      return -2147483102;
    }
  }

  /* int64 */
  getInt64(): Int64 {
    const d = this.guts.layout.dataSection + 24;
    if (d + 8 <= this.guts.layout.pointersSection) {
      return injectI64(
        -2147483648 ^ decode.int32(this.guts.segment.raw, d+4),
        -96 ^ decode.int32(this.guts.segment.raw, d),
      );
    } else {
      return injectI64(-2147483648, -96);
    }
  }

  /* float32 */
  getFloat32(): f32 {
    const d = this.guts.layout.dataSection + 32;
    if (d + 4 <= this.guts.layout.pointersSection) {
      return decode.float32(123 ^ decode.int32(this.guts.segment.raw, d));
    } else {
      return -1923484748.1422;
    }
  }

  /* float64 */
  getFloat64(): f64 {
    const d = this.guts.layout.dataSection + 36;
    if (d + 8 <= this.guts.layout.pointersSection) {
      const bytes = injectI64(
        123 ^ decode.int32(this.guts.segment.raw, d+4),
        123 ^ decode.int32(this.guts.segment.raw, d),
      );
      return decode.float64(bytes);
    } else {
      return -1909817719838772387192132987.12343;
    }
  }

  /* data */
  getData(): null | Data {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : Data.get(this.guts.level, this.guts.arena, ref);
  }

  /* text */
  getText(): null | Text {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : Text.get(this.guts.level, this.guts.arena, ref);
  }
}

/*********/
/* Lists */
/*********/

export class Lists__CtorR implements StructCtorR<Lists__InstanceR> {
  fromAny(guts: AnyGutsR): Lists__InstanceR {
    return new Lists__InstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): Lists__InstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new Lists__InstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | Lists__InstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  intern(guts: StructGutsR): Lists__InstanceR {
    return new Lists__InstanceR(guts);
  }

  compiledBytes(): Bytes {
    return { data: 48, pointers: 32 };
  }

  empty(): Lists__InstanceR {
    const guts = RefedStruct.empty(blob);
    return new Lists__InstanceR(guts);
  }

  /* Defaults */
  defaultVoidList(): VoidList {
    const meta = defaults["0x87c1c2a58b6ddc27"].voidList;
    return VoidList.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultBoolList(): BoolList {
    const meta = defaults["0x87c1c2a58b6ddc27"].boolList;
    return BoolList.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultUint8List(): UInt8List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return UInt8List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultUint16List(): UInt16List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return UInt16List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultUint32List(): UInt32List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return UInt32List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultUint64List(): UInt64List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return UInt64List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultInt8List(): Int8List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return Int8List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultInt16List(): Int16List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return Int16List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultInt32List(): Int32List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return Int32List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultInt64List(): Int64List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return Int64List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultFloat32List(): Float32List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return Float32List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultFloat64List(): Float64List {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return Float64List.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultDataList(): PointerListR<NonboolListGutsR, Data> {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return pointers(Data).deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultTextList(): PointerListR<NonboolListGutsR, Text> {
    const meta = defaults["0x87c1c2a58b6ddc27"].uint8List;
    return pointers(Text).deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
}

export class Lists__InstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }

  /* voidList */
  getVoidList(): null | VoidList {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : VoidList.get(this.guts.level, this.guts.arena, ref);
  }

  /* boolList */
  getBoolList(): null | BoolList {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : BoolList.get(this.guts.level, this.guts.arena, ref);
  }

  /* uint8List */
  getUint8List(): null | UInt8List {
    const ref = this.guts.pointersWord(16);
    return ref === null ? null : UInt8List.get(this.guts.level, this.guts.arena, ref);
  }

  /* uint16List */
  getUint16List(): null | UInt16List {
    const ref = this.guts.pointersWord(24);
    return ref === null ? null : UInt16List.get(this.guts.level, this.guts.arena, ref);
  }

  /* uint32List */
  getUint32List(): null | UInt32List {
    const ref = this.guts.pointersWord(32);
    return ref === null ? null : UInt32List.get(this.guts.level, this.guts.arena, ref);
  }

  /* uint64List */
  getUint64List(): null | UInt64List {
    const ref = this.guts.pointersWord(40);
    return ref === null ? null : UInt64List.get(this.guts.level, this.guts.arena, ref);
  }

  /* int8List */
  getInt8List(): null | Int8List {
    const ref = this.guts.pointersWord(48);
    return ref === null ? null : Int8List.get(this.guts.level, this.guts.arena, ref);
  }

  /* int16List */
  getInt16List(): null | Int16List {
    const ref = this.guts.pointersWord(56);
    return ref === null ? null : Int16List.get(this.guts.level, this.guts.arena, ref);
  }

  /* int32List */
  getInt32List(): null | Int32List {
    const ref = this.guts.pointersWord(64);
    return ref === null ? null : Int32List.get(this.guts.level, this.guts.arena, ref);
  }

  /* int64List */
  getInt64List(): null | Int64List {
    const ref = this.guts.pointersWord(72);
    return ref === null ? null : Int64List.get(this.guts.level, this.guts.arena, ref);
  }

  /* float32List */
  getFloat32List(): null | Float32List {
    const ref = this.guts.pointersWord(80);
    return ref === null ? null : Float32List.get(this.guts.level, this.guts.arena, ref);
  }

  /* float64List */
  getFloat64List(): null | Float64List {
    const ref = this.guts.pointersWord(88);
    return ref === null ? null : Float64List.get(this.guts.level, this.guts.arena, ref);
  }

  /* dataList */
  getDataList(): null | PointerListR<NonboolListGutsR, Data> {
    const ref = this.guts.pointersWord(96);
    return ref === null ? null : pointers(Data).get(this.guts.level, this.guts.arena, ref);
  }

  /* textList */
  getTextList(): null | PointerListR<NonboolListGutsR, Text> {
    const ref = this.guts.pointersWord(104);
    return ref === null ? null : pointers(Text).get(this.guts.level, this.guts.arena, ref);
  }
}

/***********/
/* Nesteds */
/***********/

export class Nesteds__CtorR implements StructCtorR<Nesteds__InstanceR> {
  fromAny(guts: AnyGutsR): Nesteds__InstanceR {
    return new Nesteds__InstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): Nesteds__InstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new Nesteds__InstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | Nesteds__InstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  intern(guts: StructGutsR): Nesteds__InstanceR {
    return new Nesteds__InstanceR(guts);
  }

  compiledBytes(): Bytes {
    return { data: 48, pointers: 32 };
  }

  empty(): Nesteds__InstanceR {
    const guts = RefedStruct.empty(blob);
    return new Nesteds__InstanceR(guts);
  }

  /* Defaults */
  defaultLeaves(): Leaves__InstanceR {
    const meta = defaults["0xce8354878bc98e17"].leaves;
    return Leaves.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultLeavesList(): StructListR<Leaves__InstanceR> {
    const meta = defaults["0xce8354878bc98e17"].leaves;
    return structs(Leaves).deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultLists(): Lists__InstanceR {
    const meta = defaults["0xce8354878bc98e17"].lists;
    return Lists.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultListsList(): StructListR<Lists__InstanceR> {
    const meta = defaults["0xce8354878bc98e17"].listsList;
    return structs(Lists).deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
}

export class Nesteds__InstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }

  /* leaves */
  getLeaves(): null | Leaves__InstanceR {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : Leaves.get(this.guts.level, this.guts.arena, ref);
  }

  /* leavesList */
  getLeavesList(): null | StructListR<Leaves__InstanceR> {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : structs(Leaves).get(this.guts.level, this.guts.arena, ref);
  }

  /* leavesListList */
  getLeavesListList(): null | PointerListR<NonboolListGutsR, StructListR<Leaves__InstanceR>> {
    const ref = this.guts.pointersWord(16);
    return ref === null ? null : pointers(structs(Leaves)).get(this.guts.level, this.guts.arena, ref);
  }

  /* lists */
  getLists(): null | Lists__InstanceR {
    const ref = this.guts.pointersWord(24);
    return ref === null ? null : Lists.get(this.guts.level, this.guts.arena, ref);
  }

  /* listsList */
  getListsList(): null | StructListR<Lists__InstanceR> {
    const ref = this.guts.pointersWord(32);
    return ref === null ? null : structs(Lists).get(this.guts.level, this.guts.arena, ref);
  }

  /* listsListList */
  getListsListList(): null | PointerListR<NonboolListGutsR, StructListR<Lists__InstanceR>> {
    const ref = this.guts.pointersWord(40);
    return ref === null ? null : pointers(structs(Lists)).get(this.guts.level, this.guts.arena, ref);
  }
}

export const Leaves = new Leaves__CtorR();
export const Lists = new Lists__CtorR();
export const Nesteds = new Nesteds__CtorR();
