/* @flow */

import type { Bytes, StructLayout } from "@capnp-js/layout";
import type { Byte, Pointer, SegmentB, Word } from "@capnp-js/memory";
import type { StructGutsR } from "@capnp-js/reader-core";

import type { ArenaB, AnyGutsB } from "../index";

import { get, set } from "@capnp-js/bytes";
import { uint16 as decodeTag } from "@capnp-js/read-data";
import { uint16 as encodeTag } from "@capnp-js/write-data";
import { isStaleStruct, structBytes } from "@capnp-js/layout";
import { PointerTypeError } from "@capnp-js/internal-error";
import { IncorrectTagError } from "@capnp-js/programmer-error";
import { preallocatedStruct } from "@capnp-js/write-pointers";
import { fixedWidthStructCopy } from "@capnp-js/copy-pointers";
import { localRetarget, nonlocalRetarget } from "./retarget";

type uint = number;
type u8 = number;
type u16 = number;
type u19 = number;

type MaskedByte = [ uint, u8 ];
type MaskedBytes = $ReadOnlyArray<MaskedByte>;
type ByteSequence = [ uint, u19 ];
type ByteSequences = $ReadOnlyArray<ByteSequence>;
type UnionLayout = {
  partialDataBytes: MaskedBytes,
  dataBytes: ByteSequences,
  pointersBytes: ByteSequences,
};

export interface StructGutsB extends StructGutsR {
  +arena: ArenaB;
  +segment: SegmentB;

  setTag(fieldTag: u16, offset: u19, members: UnionLayout): void;
  initTag(fieldTag: u16, offset: u19, members: UnionLayout): void;
  maskPartialDataBytes(partialBytes: MaskedBytes): void;
  zeroDataBytes(bytes: ByteSequences): void;
  zeroPointersBytes(bytes: ByteSequences): void;
  pointersWord(offset: u19): Word<SegmentB>;
}

export class InlineStruct implements StructGutsB {
  +level: uint;
  +arena: ArenaB;
  +segment: SegmentB;
  +layout: StructLayout;

  static fromAny(guts: AnyGutsB): StructGutsB {
    if (guts.layout.tag === "struct") {
      return (guts: any); // eslint-disable-line flowtype/no-weak-types
    } else {
      //TODO: Flow doesn't dig down with this refinement even though it's
      //      unique. Circumvent for now, but try to get it fixed.
      if (guts.layout.tag === "bool list") {
        throw new PointerTypeError(["struct"], "list");
      } else if (guts.layout.tag === "non-bool list") {
        throw new PointerTypeError(["struct"], "list");
      } else {
        //TODO: Get Flow to refine this: (guts.layout.tag: "cap");
        throw new PointerTypeError(["struct"], "capability");
      }
    }
  }

  constructor(level: uint, arena: ArenaB, segment: SegmentB, layout: StructLayout) {
    this.level = level;
    this.arena = arena;
    this.segment = segment;
    this.layout = layout;
  }

  getTag(offset: u19): u16 {
    return decodeTag(this.segment.raw, this.layout.dataSection + offset);
  }

  checkTag(fieldTag: u16, offset: u19): void {
    const currentTag = this.getTag(offset);
    if (currentTag !== fieldTag) {
      throw new IncorrectTagError(currentTag, fieldTag);
    }
  }

  set(level: uint, arena: ArenaB, ref: Word<SegmentB>): void {
    this.arena.structCopy(this.layout, this.segment, level, arena, ref);
  }

  setFixedWidth(level: uint, arena: ArenaB, object: Word<SegmentB>, bytes: Bytes): void {
    fixedWidthStructCopy(this.arena, this.layout, this.segment, level, arena, object, bytes);
  }

  setTag(fieldTag: u16, offset: u19, members: UnionLayout): void {
    /* No-op if the tag hasn't changed. */
    if (fieldTag !== this.getTag(offset)) {
      this.maskPartialDataBytes(members.partialDataBytes);
      this.zeroDataBytes(members.dataBytes);
      this.zeroPointersBytes(members.pointersBytes);
      encodeTag(fieldTag, this.segment.raw, this.layout.dataSection + offset);
    }
  }

  initTag(fieldTag: u16, offset: u19, members: UnionLayout): void {
    this.maskPartialDataBytes(members.partialDataBytes);
    this.zeroDataBytes(members.dataBytes);
    this.zeroPointersBytes(members.pointersBytes);
    encodeTag(fieldTag, this.segment.raw, this.layout.dataSection + offset);
  }

  maskPartialDataBytes(partialBytes: MaskedBytes): void {
    partialBytes.forEach(zeros => {
      const position = this.layout.dataSection + zeros[0];
      set(get(position, this.segment.raw) & zeros[1], position, this.segment.raw);
    });
  }

  zeroDataBytes(bytes: ByteSequences): void {
    bytes.forEach(zeros => { this.arena.zero(this.dataByte(zeros[0]), zeros[1]); });
  }

  zeroPointersBytes(bytes: ByteSequences): void {
    bytes.forEach(zeros => { this.arena.zero(this.pointersWord(zeros[0]), zeros[1]); });
  }

  pointersWord(offset: u19): Word<SegmentB> {
    return {
      segment: this.segment,
      position: this.layout.pointersSection + offset,
    };
  }

  dataByte(offset: u19): Byte<SegmentB> {
    return {
      segment: this.segment,
      position: this.layout.dataSection + offset,
    };
  }
}

export class RefedStruct extends InlineStruct implements StructGutsB {
  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>, compiledBytes: Bytes): this {
    const p = arena.pointer(ref);
    const layout = arena.specificStructLayout(p, compiledBytes);
    if (isStaleStruct(compiledBytes, layout.bytes)) {
      return this.upgrade(level, arena, ref, p.object.segment, layout, compiledBytes);
    } else {
      return new this(level, arena, p.object.segment, layout);
    }
  }

  /* Create a new struct with encoding `fresh`, and then populate it with the
   * data and pointers from layout `stale` (pointers are updated to target the
   * same objects as the old pointers). Zero-fill layout `stale` and the new
   * struct's unknown data and pointers (some old pointers may remain non-zero
   * since they may be used as landing pads for single-hop far pointers in the
   * new struct). A struct pointer that resolves to the new struct is written to
   * `ref`. */
  static upgrade(
    level: uint, arena: ArenaB, ref: Word<SegmentB>,
    segment: SegmentB, stale: StructLayout, fresh: Bytes
  ): this {
    const width = fresh.data + fresh.pointers;
    const object = arena.preallocate(width, segment);

    /* Move the data section. */
    const source: {| +segment: SegmentB, position: number |} = {
      segment,
      position: stale.dataSection,
    };
    arena.write(source, stale.bytes.data, object);
    arena.zero(source, stale.bytes.data);

    /* Zero the new data section's tail of unknowns. */
    const target = {
      segment: object.segment,
      position: object.position + stale.bytes.data,
    };

    /* Move the pointers section. */
    source.position = stale.pointersSection;
    target.position = object.position + fresh.data;
    const retarget = source.segment.id === target.segment.id ? localRetarget : nonlocalRetarget;
    for (; source.position<stale.pointersSection; source.position+=8,
                                                  target.position+=8) {
      retarget(arena, source, target);
    }

    const layout = {
      tag: "struct",
      bytes: fresh,
      dataSection: object.position,
      pointersSection: object.position + fresh.data,
      end: object.position + width,
    };

    preallocatedStruct(ref, object, fresh);

    return new this(level, arena, object.segment, layout);
  }

  static validate(p: Pointer<SegmentB>, compiledBytes: Bytes): void {
    if (p.typeBits !== 0x00) {
      if (p.typeBits === 0x01) {
        throw new PointerTypeError(["struct"], "list");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["struct"], "capability");
      }
    }

    isStaleStruct(compiledBytes, structBytes(p.hi));
  }

  constructor(level: uint, arena: ArenaB, segment: SegmentB, layout: StructLayout) {
    super(level+1, arena, segment, layout);
  }
}
