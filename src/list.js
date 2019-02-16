/* @flow */

import type { Int64 } from "@capnp-js/int64";
import type { UInt64 } from "@capnp-js/uint64";
import type { NonboolListEncoding } from "@capnp-js/layout";
import type { Pointer, SegmentB, Word } from "@capnp-js/memory";

import type {
  CtorR,
  StructListR,
  PointerListR,
  StructGutsR,
  BoolListGutsR,
  NonboolListGutsR,
  CapGutsR,
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
  ReaderCtor,
  StructCtorB,
  PointerElementCtorB,
  ListCtorB,
  DataListB,
  StructListCtorB,
  PointerListCtorB,
  StructListB,
  PointerListB,
} from "./index";

import type { BoolListGutsB } from "./guts/boolList";
import type { NonboolListGutsB } from "./guts/nonboolList";

import * as decode from "@capnp-js/read-data";
import * as encode from "@capnp-js/write-data";
import { inlineCompositeEncoding } from "@capnp-js/read-pointers";
import { inject as injectI64 } from "@capnp-js/int64";
import { inject as injectU64 } from "@capnp-js/uint64";
import { isNull } from "@capnp-js/memory";
import { listEncodings, isStaleList } from "@capnp-js/layout";
import { u3_mask } from "@capnp-js/tiny-uint";


import {
  PointerTypeError,
  ListAlignmentError,
} from "@capnp-js/internal-error";

import Orphan from "./Orphan";

import { RefedBoolList } from "./guts/boolList";
import { RefedNonboolList } from "./guts/nonboolList";


/*TODO: Consider memoizing list specializations (`pointers` and `structs` on
        both the reader and builder sides). Without memoization, can the virtual
        machine detect identically shaped classes, or do I lose monomorphic
        performance? */

type uint = number;
type u29 = number;
type u30 = number;

export function structs<R: {+guts: StructGutsR}, B: ReaderCtor<StructGutsR, R>>(Element: StructCtorB<R, B>): StructListCtorB<R, B> {
  return class Structs implements StructListB<R, B> {
    +guts: NonboolListGutsB;

    static fromAny(guts: AnyGutsB): this {
      return new this(RefedNonboolList.fromAny(guts));
    }

    static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
      //TODO: Does RefedNonboolList upgrade narrow lists already? Or have I missed that detail?
      const guts = RefedNonboolList.derefInline(level, arena, ref, this.encoding());
      return new this(guts);
    }

    static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
      return isNull(ref) ? null : this.deref(level, arena, ref);
    }

    static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, StructListR<R>, this> {
      const p = arena.pointer(ref);
      arena.zero(ref, 8);
      return new Orphan(this, arena, p);
    }

    static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, StructListR<R>, this> {
      return isNull(ref) ? null : this.unref(level, arena, ref);
    }

    static validate(p: Pointer<SegmentB>): void {
      if (p.typeBits !== 0x01) {
        if (p.typeBits === 0x00) {
          throw new PointerTypeError(["list"], "struct");
        } else {
          (p.typeBits: 0x03);
          throw new PointerTypeError(["list"], "capability");
        }
      }

      const c = u3_mask(p.hi, 0x07);
      if (c === 0x01) {
        throw new ListAlignmentError("byte aligned", "bit aligned");
      } else {
        const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
        isStaleList(this.encoding(), encoding);
      }
    }

    static encoding(): NonboolListEncoding {
      return {
        flag: 0x07,
        bytes: Element.compiledBytes(),
      };
    }

    constructor(guts: NonboolListGutsB) {
      this.guts = guts;
    }

    reader(Ctor: CtorR<NonboolListGutsR, StructListR<R>>): StructListR<R> {
      return Ctor.intern(this.guts);
    }

    length(): u29 | u30 {
      return this.guts.layout.length;
    }

    get(index: u29 | u30): B {
      if (index < 0 || this.guts.layout.length <= index) {
        throw new RangeError();
      }

      const stride = this.guts.stride();
      const dataSection = this.guts.layout.begin + index * stride;
      const guts = this.guts.inlineStruct(dataSection, dataSection + stride);
      return Element.intern(guts);
    }

    setWithCaveats(index: u29 | u30, value: R | B): void {
      if (index < 0 || this.guts.layout.length <= index) {
        throw new RangeError();
      }

      const object = {
        segment: this.guts.segment,
        position: this.guts.layout.begin + index * this.guts.stride(),
      };

      value.guts.setFixedWidth(this.guts.level, this.guts.arena, object, this.guts.layout.encoding.bytes);
    }

    map<T, THIS>(fn: (value: B, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
      let arr = [];
      const stride = this.guts.stride();
      let dataSection = this.guts.layout.begin;
      let end = dataSection + stride;
      for (let i=0; i<this.guts.layout.length; ++i,
                                               dataSection+=stride,
                                               end+=stride) {
        const guts = this.guts.inlineStruct(dataSection, end);
        arr.push(fn.call(thisArg, Element.intern(guts), i, this));
      }

      return arr;
    }

    forEach<THIS>(fn: (value: B, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
      const stride = this.guts.stride();
      let dataSection = this.guts.layout.begin;
      let end = dataSection + stride;
      for (let i=0; i<this.guts.layout.length; ++i,
                                               dataSection+=stride,
                                               end+=stride) {
        const guts = this.guts.inlineStruct(dataSection, end);
        fn.call(thisArg, Element.intern(guts), i, this);
      }
    }

    reduce<T>(fn: (previous: T, current: B, index: u29 | u30, list: this) => T, acc: T): T {
      const stride = this.guts.stride();
      let dataSection = this.guts.layout.begin;
      let end = dataSection + stride;
      for (let i=0; i<this.guts.layout.length; ++i,
                                               dataSection+=stride,
                                               end+=stride) {
        const guts = this.guts.inlineStruct(dataSection, end);
        acc = fn(acc, Element.intern(guts), i, this);
      }

      return acc;
    }
  };
}

export function pointers<GUTS: BoolListGutsR | NonboolListGutsR | CapGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>>(Element: PointerElementCtorB<GUTS, R, B>): PointerListCtorB<GUTS, R, B> {
  return class Pointers implements PointerListB<GUTS, R, B> {
    +guts: NonboolListGutsB;

    static fromAny(guts: AnyGutsB): this {
      return new this(RefedNonboolList.fromAny(guts));
    }

    static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
      const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
      return new this(guts);
    }

    static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
      return isNull(ref) ? null : this.deref(level, arena, ref);
    }

    static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, PointerListR<GUTS, R>, this> {
      const p = arena.pointer(ref);
      arena.zero(ref, 8);
      return new Orphan(this, arena, p);
    }

    static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, PointerListR<GUTS, R>, this> {
      return isNull(ref) ? null : this.unref(level, arena, ref);
    }

    static validate(p: Pointer<SegmentB>): void {
      if (p.typeBits !== 0x01) {
        if (p.typeBits === 0x00) {
          throw new PointerTypeError(["list"], "struct");
        } else {
          (p.typeBits: 0x03);
          throw new PointerTypeError(["list"], "capability");
        }
      }

      const c = u3_mask(p.hi, 0x07);
      if (c === 0x01) {
        throw new ListAlignmentError("byte aligned", "bit aligned");
      } else {
        const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
        isStaleList(this.encoding(), encoding);
      }
    }

    static encoding(): NonboolListEncoding {
      return listEncodings[0x06];
    }

    constructor(guts: NonboolListGutsB) {
      this.guts = guts;
    }

    reader(Ctor: CtorR<NonboolListGutsR, PointerListR<GUTS, R>>): PointerListR<GUTS, R> {
      return Ctor.intern(this.guts);
    }

    length(): u29 | u30 {
      return this.guts.layout.length;
    }

    has(index: u29 | u30): boolean {
      if (index < 0 || this.guts.layout.length <= index) {
        throw new RangeError();
      }

      const ref = {
        segment: this.guts.segment,
        position: this.guts.pointersBegin() + index * this.guts.stride(),
      };

      return !isNull(ref);
    }

    get(index: u29 | u30): null | B {
      if (index < 0 || this.guts.layout.length <= index) {
        throw new RangeError();
      }

      const ref: Word<SegmentB> = {
        segment: this.guts.segment,
        position: this.guts.pointersBegin() + index * this.guts.stride(),
      };

      return Element.get(this.guts.level, this.guts.arena, ref);
    }

    set(index: u29 | u30, value: R | B): void {
      if (index < 0 || this.guts.layout.length <= index) {
        throw new RangeError();
      }

      const ref = {
        segment: this.guts.segment,
        position: this.guts.pointersBegin() + index * this.guts.stride(),
      };

      value.guts.set(this.guts.level, this.guts.arena, ref);
    }

    disown(index: u29 | u30): null | Orphan<GUTS, R, B> {
      if (index < 0 || this.guts.layout.length <= index) {
        throw new RangeError();
      }

      const ref: Word<SegmentB> = {
        segment: this.guts.segment,
        position: this.guts.pointersBegin() + index * this.guts.stride(),
      };

      if (isNull(ref)) {
        return null;
      } else {
        const p = this.guts.arena.pointer(ref);
        this.guts.arena.zero(ref, 8);
        return new Orphan(Element, this.guts.arena, p);
      }
    }

    adopt(index: u29 | u30, value: Orphan<GUTS, R, B>): void {
      if (index < 0 || this.guts.layout.length <= index) {
        throw new RangeError();
      }

      const ref = {
        segment: this.guts.segment,
        position: this.guts.pointersBegin() + index * this.guts.stride(),
      };

      value.guts.adopt(this.guts.arena, ref);
    }

    map<T, THIS>(fn: (value: null | B, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
      let arr = [];
      const stride = this.guts.stride();
      const ref: Word<SegmentB> = {
        segment: this.guts.segment,
        position: this.guts.pointersBegin(),
      };
      for (let i=0; i<this.guts.layout.length; ++i,
                                               ref.position+=stride) {
        const element = Element.get(this.guts.level, this.guts.arena, ref);
        arr.push(fn.call(thisArg, element, i, this));
      }

      return arr;
    }

    forEach<THIS>(fn: (value: null | B, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
      const stride = this.guts.stride();
      const ref: Word<SegmentB> = {
        segment: this.guts.segment,
        position: this.guts.pointersBegin(),
      };
      for (let i=0; i<this.guts.layout.length; ++i,
                                               ref.position+=stride) {
        const element = Element.get(this.guts.level, this.guts.arena, ref);
        fn.call(thisArg, element, i, this);
      }
    }

    reduce<T>(fn: (previous: T, current: null | B, index: u29 | u30, list: this) => T, acc: T): T {
      const stride = this.guts.stride();
      const ref: Word<SegmentB> = {
        segment: this.guts.segment,
        position: this.guts.pointersBegin(),
      };
      for (let i=0; i<this.guts.layout.length; ++i,
                                               ref.position+=stride) {
        const element = Element.get(this.guts.level, this.guts.arena, ref);
        acc = fn(acc, element, i, this);
      }

      return acc;
    }
  };
}

export class VoidList implements DataListB<void> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, VoidListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, VoidListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x00];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, VoidListR>): VoidListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }
  }

  set(index: u29 | u30, value: void): void { // eslint-disable-line no-unused-vars
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }
  }

  map<T, THIS>(fn: (value: void, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    for (let i=0; i<this.guts.layout.length; ++i) {
      arr.push(fn.call(thisArg, undefined, i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: void, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    for (let i=0; i<this.guts.layout.length; ++i) {
      fn.call(thisArg, undefined, i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: void, index: u29 | u30, list: this) => T, acc: T): T {
    for (let i=0; i<this.guts.layout.length; ++i) {
      acc = fn(acc, undefined, i, this);
    }

    return acc;
  }
}
(VoidList: ListCtorB<NonboolListGutsR, VoidListR, VoidList>);

export class BoolList implements DataListB<boolean>  {
  +guts: BoolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedBoolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedBoolList.deref(level, arena, ref);
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<BoolListGutsR, BoolListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<BoolListGutsR, BoolListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      return;
    } else {
      throw new ListAlignmentError("bit aligned", "byte aligned");
    }
  }

  static encoding(): null {
    return null;
  }

  constructor(guts: BoolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<BoolListGutsR, BoolListR>): BoolListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 {
    return this.guts.layout.length;
  }

  get(index: u29): boolean {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const p = this.guts.layout.begin + (index >>> 3);
    return !!decode.bit(this.guts.segment.raw, p, u3_mask(index, 0x07));
  }

  set(index: u29, value: boolean): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const p = this.guts.layout.begin + (index >>> 3);
    encode.bit(value, this.guts.segment.raw, p, u3_mask(index, 0x07));
  }

  map<T, THIS>(fn: (value: boolean, index: u29, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    for (let index=0; index<this.guts.layout.length; ++index) {
      const b = !!decode.bit(this.guts.segment.raw, this.guts.layout.begin + (index>>>3), u3_mask(index, 0x07));
      arr.push(fn.call(thisArg, b, index, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: boolean, index: u29, list: this) => mixed, thisArg?: THIS): void {
    for (let index=0; index<this.guts.layout.length; ++index) {
      const b = !!decode.bit(this.guts.segment.raw, this.guts.layout.begin + (index>>>3), u3_mask(index, 0x07));
      fn.call(thisArg, b, index, this);
    }
  }

  reduce<T>(fn: (previous: T, current: boolean, index: u29, list: this) => T, acc: T): T {
    for (let index=0; index<this.guts.layout.length; ++index) {
      const b = !!decode.bit(this.guts.segment.raw, this.guts.layout.begin + (index>>>3), u3_mask(index, 0x07));
      acc = fn(acc, b, index, this);
    }

    return acc;
  }
}
(BoolList: ListCtorB<BoolListGutsR, BoolListR, BoolList>);

type i8 = number;

export class Int8List implements DataListB<i8> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, Int8ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, Int8ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x02];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, Int8ListR>): Int8ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): i8 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    return decode.int8(this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  set(index: u29 | u30, value: i8): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    encode.int8(value, this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  map<T, THIS>(fn: (value: i8, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      arr.push(fn.call(thisArg, decode.int8(this.guts.segment.raw, p), i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: i8, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      fn.call(thisArg, decode.int8(this.guts.segment.raw, p), i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: i8, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      acc = fn(acc, decode.int8(this.guts.segment.raw, p), i, this);
    }

    return acc;
  }
}
(Int8List: ListCtorB<NonboolListGutsR, Int8ListR, Int8List>);

type i16 = number;

export class Int16List implements DataListB<i16> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, Int16ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, Int16ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x03];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, Int16ListR>): Int16ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): i16 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    return decode.int16(this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  set(index: u29 | u30, value: i16): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    encode.int16(value, this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  map<T, THIS>(fn: (value: i16, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      arr.push(fn.call(thisArg, decode.int16(this.guts.segment.raw, p), i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: i16, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      fn.call(thisArg, decode.int16(this.guts.segment.raw, p), i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: i16, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      acc = fn(acc, decode.int16(this.guts.segment.raw, p), i, this);
    }

    return acc;
  }
}
(Int16List: ListCtorB<NonboolListGutsR, Int16ListR, Int16List>);

type i32 = number;

export class Int32List implements DataListB<i32> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, Int32ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, Int32ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  //TODO: Can I clobber the `encoding` method?
  //      Much of the logic from `validate` can be parametrized by the `encoding` value, right?
  static encoding(): NonboolListEncoding {
    return listEncodings[0x04];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, Int32ListR>): Int32ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): i32 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    return decode.int32(this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  set(index: u29 | u30, value: i32): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    encode.int32(value, this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  map<T, THIS>(fn: (value: i32, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      arr.push(fn.call(thisArg, decode.int32(this.guts.segment.raw, p), i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: i32, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      fn.call(thisArg, decode.int32(this.guts.segment.raw, p), i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: i32, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      acc = fn(acc, decode.int32(this.guts.segment.raw, p), i, this);
    }

    return acc;
  }
}
(Int32List: ListCtorB<NonboolListGutsR, Int32ListR, Int32List>);

export class Int64List implements DataListB<Int64> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, Int64ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, Int64ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x05];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, Int64ListR>): Int64ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): Int64 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const p = this.guts.layout.begin + index * this.guts.stride();
    return injectI64(
      decode.int32(this.guts.segment.raw, p+4),
      decode.int32(this.guts.segment.raw, p),
    );
  }

  set(index: u29 | u30, value: Int64): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const p = this.guts.layout.begin + index * this.guts.stride();
    encode.int32(value[0], this.guts.segment.raw, p+4);
    encode.int32(value[1], this.guts.segment.raw, p);
  }

  map<T, THIS>(fn: (value: Int64, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      const value = injectI64(
        decode.int32(this.guts.segment.raw, p+4),
        decode.int32(this.guts.segment.raw, p),
      );
      arr.push(fn.call(thisArg, value, i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: Int64, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      const value = injectI64(
        decode.int32(this.guts.segment.raw, p+4),
        decode.int32(this.guts.segment.raw, p),
      );
      fn.call(thisArg, value, i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: Int64, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      const current = injectI64(
        decode.int32(this.guts.segment.raw, p+4),
        decode.int32(this.guts.segment.raw, p),
      );
      acc = fn(acc, current, i, this);
    }

    return acc;
  }
}
(Int64List: ListCtorB<NonboolListGutsR, Int64ListR, Int64List>);

type u8 = number;

export class UInt8List implements DataListB<u8> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, UInt8ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, UInt8ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x02];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, UInt8ListR>): UInt8ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): u8 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    return decode.uint8(this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  set(index: u29 | u30, value: u8): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    encode.uint8(value, this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  map<T, THIS>(fn: (value: u8, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      arr.push(fn.call(thisArg, decode.uint8(this.guts.segment.raw, p), i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: u8, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      fn.call(thisArg, decode.uint8(this.guts.segment.raw, p), i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: u8, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      acc = fn(acc, decode.uint8(this.guts.segment.raw, p), i, this);
    }

    return acc;
  }
}
(UInt8List: ListCtorB<NonboolListGutsR, UInt8ListR, UInt8List>);

type u16 = number;

export class UInt16List implements DataListB<u16> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, UInt16ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, UInt16ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x03];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, UInt16ListR>): UInt16ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): u16 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    return decode.uint16(this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  set(index: u29 | u30, value: u16): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    encode.uint16(value, this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  map<T, THIS>(fn: (value: u16, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      arr.push(fn.call(thisArg, decode.uint16(this.guts.segment.raw, p), i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: u16, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      fn.call(thisArg, decode.uint16(this.guts.segment.raw, p), i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: u16, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      acc = fn(acc, decode.uint16(this.guts.segment.raw, p), i, this);
    }

    return acc;
  }
}
(UInt16List: ListCtorB<NonboolListGutsR, UInt16ListR, UInt16List>);

type u32 = number;

export class UInt32List implements DataListB<u32> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, UInt32ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, UInt32ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x04];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, UInt32ListR>): UInt32ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): u32 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    return decode.int32(this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride()) >>> 0;
  }

  set(index: u29 | u30, value: u32): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    encode.int32(value, this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  map<T, THIS>(fn: (value: u32, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      arr.push(fn.call(thisArg, decode.int32(this.guts.segment.raw, p) >>> 0, i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: u32, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      fn.call(thisArg, decode.int32(this.guts.segment.raw, p) >>> 0, i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: u32, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      acc = fn(acc, decode.int32(this.guts.segment.raw, p) >>> 0, i, this);
    }

    return acc;
  }
}
(UInt32List: ListCtorB<NonboolListGutsR, UInt32ListR, UInt32List>);

export class UInt64List implements DataListB<UInt64> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, UInt64ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, UInt64ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x05];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, UInt64ListR>): UInt64ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): UInt64 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const p = this.guts.layout.begin + index * this.guts.stride();
    return injectU64(
      decode.int32(this.guts.segment.raw, p+4),
      decode.int32(this.guts.segment.raw, p+4),
    );
  }

  set(index: u29 | u30, value: UInt64): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const p = this.guts.layout.begin + index * this.guts.stride();
    encode.int32(value[0], this.guts.segment.raw, p+4);
    encode.int32(value[1], this.guts.segment.raw, p);
  }

  map<T, THIS>(fn: (value: UInt64, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      const current = injectU64(
        decode.int32(this.guts.segment.raw, p+4),
        decode.int32(this.guts.segment.raw, p),
      );
      arr.push(fn.call(thisArg, current, i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: UInt64, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      const current = injectU64(
        decode.int32(this.guts.segment.raw, p+4),
        decode.int32(this.guts.segment.raw, p),
      );
      fn.call(thisArg, current, i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: UInt64, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      const current = injectU64(
        decode.int32(this.guts.segment.raw, p+4),
        decode.int32(this.guts.segment.raw, p),
      );
      acc = fn(acc, current, i, this);
    }

    return acc;
  }
}
(UInt64List: ListCtorB<NonboolListGutsR, UInt64ListR, UInt64List>);

type f32 = number;

export class Float32List implements DataListB<f32> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, Float32ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, Float32ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x04];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, Float32ListR>): Float32ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): f32 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const bytes = decode.int32(this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
    return decode.float32(bytes);
  }

  set(index: u29 | u30, value: f32): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const bytes = encode.float32(value);
    encode.int32(bytes, this.guts.segment.raw, this.guts.layout.begin + index * this.guts.stride());
  }

  map<T, THIS>(fn: (value: f32, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      arr.push(fn.call(thisArg, decode.float32(decode.int32(this.guts.segment.raw, p)), i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: f32, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      fn.call(thisArg, decode.float32(decode.int32(this.guts.segment.raw, p)), i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: f32, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      acc = fn(acc, decode.float32(decode.int32(this.guts.segment.raw, p)), i, this);
    }

    return acc;
  }
}
(Float32List: ListCtorB<NonboolListGutsR, Float32ListR, Float32List>);

type f64 = number;

export class Float64List implements DataListB<f64> {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const guts = RefedNonboolList.derefSubword(level, arena, ref, this.encoding());
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, Float64ListR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, Float64ListR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x05];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, Float64ListR>): Float64ListR {
    return Ctor.intern(this.guts);
  }

  length(): u29 | u30 {
    return this.guts.layout.length;
  }

  get(index: u29 | u30): f64 {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const p = this.guts.layout.begin + index * this.guts.stride();
    const bytes = injectI64(
      decode.int32(this.guts.segment.raw, p+4),
      decode.int32(this.guts.segment.raw, p)
    );

    return decode.float64(bytes);
  }

  set(index: u29 | u30, value: f64): void {
    if (index < 0 || this.guts.layout.length <= index) {
      throw new RangeError();
    }

    const p = this.guts.layout.begin + index * this.guts.stride();
    const bytes = encode.float64(value);
    encode.int32(bytes[0], this.guts.segment.raw, p+4);
    encode.int32(bytes[1], this.guts.segment.raw, p);
  }

  map<T, THIS>(fn: (value: f64, index: u29 | u30, list: this) => T, thisArg?: THIS): Array<T> {
    let arr = [];
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      const bytes = injectI64(
        decode.int32(this.guts.segment.raw, p+4),
        decode.int32(this.guts.segment.raw, p), //TODO: WHy isn't eslint flagging the missing trailing comma?
      );
      const value = decode.float64(bytes);
      arr.push(fn.call(thisArg, value, i, this));
    }

    return arr;
  }

  forEach<THIS>(fn: (value: f64, index: u29 | u30, list: this) => mixed, thisArg?: THIS): void {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      const bytes = injectI64(
        decode.int32(this.guts.segment.raw, p+4),
        decode.int32(this.guts.segment.raw, p),
      );
      const value = decode.float64(bytes);

      fn.call(thisArg, value, i, this);
    }
  }

  reduce<T>(fn: (previous: T, current: f64, index: u29 | u30, list: this) => T, acc: T): T {
    const stride = this.guts.stride();
    for (let i=0, p=this.guts.layout.begin; i<this.guts.layout.length; ++i,
                                                                       p+=stride) {
      const bytes = injectI64(
        decode.int32(this.guts.segment.raw, p+4),
        decode.int32(this.guts.segment.raw, p),
      );
      const current = decode.float64(bytes);

      acc = fn(acc, current, i, this);
    }

    return acc;
  }
}
(Float64List: ListCtorB<NonboolListGutsR, Float64ListR, Float64List>);
