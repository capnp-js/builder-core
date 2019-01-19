/* @flow */

import type { Bytes, NonboolListEncoding, NonboolListLayout } from "@capnp-js/layout";
import type { SegmentB, Word } from "@capnp-js/memory";
import type { NonboolListGutsR } from "@capnp-js/reader-core";

import type { ArenaB, AnyGutsB  } from "../index";
import type { StructGutsB } from "./struct";

import { PointerTypeError, ListAlignmentError } from "@capnp-js/internal-error";
import { nonboolListTag } from "@capnp-js/copy-pointers";
import { isStaleList } from "@capnp-js/layout";
import { preallocated } from "@capnp-js/write-pointers";

import { InlineStruct } from "./struct";
import { localRetarget, nonlocalRetarget } from "./retarget";

type uint = number;
type u20 = number;

export interface NonboolListGutsB extends NonboolListGutsR {
  +arena: ArenaB;
  +segment: SegmentB;

  inlineStruct(dataSection: uint, end: uint): StructGutsB;
}

export class InlineNonboolList implements NonboolListGutsB {
  +level: uint;
  +arena: ArenaB;
  +segment: SegmentB;
  +layout: NonboolListLayout;

  static fromAny(guts: AnyGutsB): NonboolListGutsB {
    if (guts.layout.tag === "non-bool list") {
      return (guts: any); // eslint-disable-line flowtype/no-weak-types
    } else {
      //TODO: Flow doesn't dig down with this refinement even though it's
      //      unique. Circumvent for now, but try to get it fixed.
      if (guts.layout.tag === "struct") {
        throw new PointerTypeError(["list"], "struct");
      } else if (guts.layout.tag === "bool list") {
        throw new ListAlignmentError("byte aligned", "bit aligned");
      } else {
        //TODO: Get Flow to refine this: (guts.layout.tag: "cap");
        throw new PointerTypeError(["list"], "capability");
      }
    }
  }

  constructor(level: uint, arena: ArenaB, segment: SegmentB, layout: NonboolListLayout) {
    this.level = level;
    this.arena = arena;
    this.segment = segment;
    this.layout = layout;
  }

  stride(): u20 {
    return this.layout.encoding.bytes.data + this.layout.encoding.bytes.pointers;
  }

  pointersBegin(): uint {
    return this.layout.begin + this.layout.encoding.bytes.data;
  }

  set(level: uint, arena: ArenaB, ref: Word<SegmentB>): void {
    this.arena.nonboolListCopy(this.layout, this.segment, level, arena, ref);
  }

  inlineStruct(dataSection: uint, end: uint): StructGutsB {
    return new InlineStruct(this.level, this.arena, this.segment, {
      tag: "struct",
      bytes: this.layout.encoding.bytes,
      dataSection,
      pointersSection: dataSection + this.layout.encoding.bytes.data,
      end,
    });
  }
}

export class RefedNonboolList extends InlineNonboolList {
  static derefSubword(level: uint, arena: ArenaB, ref: Word<SegmentB>, compiledEncoding: NonboolListEncoding): this {
    const p = arena.pointer(ref);
    const layout = arena.specificNonboolListLayout(p, compiledEncoding);
    return new this(level, arena, p.object.segment, layout);
  }

  static derefInline(level: uint, arena: ArenaB, ref: Word<SegmentB>, compiledEncoding: NonboolListEncoding): this {
    const p = arena.pointer(ref);
    const layout = arena.specificNonboolListLayout(p, compiledEncoding);
    if (isStaleList(compiledEncoding, layout.encoding)) {
      return this.upgrade(level, arena, ref, p.object.segment, layout, compiledEncoding.bytes);
    } else {
      return new this(level, arena, p.object.segment, layout);
    }
  }

  /* Create a new list with encoding `fresh`, and then populate it with the data
   * and pointers from layout `stale` (pointers are updated to target the same
   * objects as the old pointers). Zero-fill layout `stale` and the new list's
   * unknown data and pointers (some old pointers may remain non-zero since they
   * may be used as landing pads for single-hop far pointers in the new list). A
   * list pointer that resolves to the new list is written to `ref`. */
  static upgrade(
    level: uint, arena: ArenaB, ref: Word<SegmentB>,
    segment: SegmentB, stale: NonboolListLayout, fresh: Bytes
  ): this {
    const width = fresh.data + fresh.pointers;
    const object = arena.preallocate(8 + stale.length * width, segment);

    /* Write the tag word. */
    nonboolListTag(object, stale.length, fresh);

    const source: Word<SegmentB> = {
      segment,
      position: stale.begin,
    };
    const target = {
      segment: object.segment,
      position: object.position + 8,
    };

    const retarget = source.segment.id === target.segment.id ? localRetarget : nonlocalRetarget;
    const pointersSlop = fresh.pointers - stale.encoding.bytes.pointers;
    for (let i=0; i<stale.length; ++i) {
      /* Move the data section. */
      arena.write(source, stale.encoding.bytes.data, target);
      arena.zero(source, stale.encoding.bytes.data);
      source.position += stale.encoding.bytes.data;
      target.position += fresh.data;

      /* Move the pointers section. */
      const end = target.position + stale.encoding.bytes.pointers;
      for (; target.position<end; source.position+=8,
                                  target.position+=8) {
        retarget(arena, source, target);
      }

      /* Align `target` with the beginning of the next data section. */
      target.position += pointersSlop;
    }

    preallocated(ref, object, 0x01, 0x07 | width); /* bytes \equiv words<<3 */

    const layout = {
      tag: "non-bool list",
      encoding: {
        flag: 0x07,
        bytes: fresh,
      },
      begin: object.position + 8,
      length: stale.length,
    };

    return new this(level, arena, object.segment, layout);
  }

  constructor(level: uint, arena: ArenaB, segment: SegmentB, layout: NonboolListLayout) {
    super(level+1, arena, segment, layout);
  }
}
