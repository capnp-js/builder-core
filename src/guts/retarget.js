/* @flow */

import type { SegmentB, Word } from "@capnp-js/memory";
import { int32 as decode } from "@capnp-js/read-data";
import { int32 as encode } from "@capnp-js/write-data";
import { u2_mask } from "@capnp-js/tiny-uint";

import type { ArenaB } from "../index";

import { isNull } from "@capnp-js/memory";

import { cap, emptyStruct, singleHop } from "@capnp-js/write-pointers";

//TODO: I need to test these better, yeah?

/* Take the object targeted by pointer `stale`, and target that object with
 * pointer `fresh`. Zero-fill pointer `stale`. The "local" of `localRetarget`
 * correlates to a precondition: Pointers `stale` and `target` have identical
 * segments. */
export function localRetarget(arena: ArenaB, stale: Word<SegmentB>, fresh: Word<SegmentB>): void {
  if (isNull(stale)) {
    arena.zero(fresh, 8);
    return;
  }

  const typeBits = u2_mask(stale.segment.raw[stale.position], 0x03);
  if (typeBits === 0x03) {
    arena.write(stale, 8, fresh);
    arena.zero(stale, 8);
  } else if (typeBits === 0x02) {
    /* Moving a far pointer within a single segment. Verbatim copies work.
     * Inconsistent with `nonlocalRetarget`'s handling of far pointers ending at
     * capabilities, this leaves such goofiness intact. */
    arena.write(stale, 8, fresh);
    arena.zero(stale, 8);
  } else {
    const hi = decode(stale.segment.raw, stale.position+4);
    if (typeBits === 0x00 && hi === 0x00000000) {
      emptyStruct(fresh);
    } else {
      /* Moving a local pointer within a single segment. Consider
       * |stale|*********|fresh|*************|object|:
       * * `stale's offset` = object - (stale + 8)
       * * `fresh's offset` = object - (fresh + 8)
       * * Subtracting equations:
       *   `stale's offset` - `fresh's offset` = fresh - stale
       *   <=> `fresh's offset` = `stale's offset` - (fresh - stale)
       *   <=> `fresh's offset` = `stale's offset` + (stale - fresh).
       * * `fresh` and `stale` are the pointer positions, which have byte units
       *   and are word aligned. Offsets, however, have 64bit word units and are
       *   packed beside the pointer's type bits. I want to verbatim copy
       *   `stale's offset` to the `fresh` pointer. Then I want to increment the
       *   `fresh` pointer's offset to point at object.
       *   - Convert to 64bit word units: (stale - fresh) >> 3.
       *   - Align with encoded offset (the 2 comes from the encoding
       *     specification):
       *     ((stale - fresh) >> 3) << 2 = (stale - fresh) >> 1.
       *   - (stale - fresh) could exceed 32 bits, making the bitshift lossy in
       *     JavaScript, so use arithmetic instead (for less lossiness--it's
       *     still imperfect):
       *     (stale - fresh) / 2.
       *   - Since `stale` and `fresh` are 64bit word aligned,
       *     (stale - fresh) / 2 has zeros in its type bits. I, therefore, don't
       *     need to mask them. */
      const offsetDiff = (stale.position - fresh.position) / 2;
      const lo = decode(stale.segment.raw, stale.position) + offsetDiff;
      encode(lo, fresh.segment.raw, fresh.position);
      encode(hi, fresh.segment.raw, fresh.position+4);
    }
    arena.zero(stale, 8);
  }
}

/* Take the object targeted by pointer `stale`, and target that object with
 * pointer `fresh`. Zero-fill pointer `stale` if it no longer serves a purpose
 * (it may serve as a landing pad for a single-hop far pointer written at
 * pointer `fresh`). The "nonlocal" of `nonlocalRetarget` correlates to a
 * precondition: Pointers `stale` and `target` have distinct segments. */
export function nonlocalRetarget(arena: ArenaB, stale: Word<SegmentB>, fresh: Word<SegmentB>): void {
  if (isNull(stale)) {
    arena.zero(fresh, 8);
    return;
  }

  const p = arena.pointer(stale);
  if (p.typeBits === 0x03) {
    /* This will silently handle cases where some dummy (library implementor,
     * not programmer) referenced a capability with a far pointer. Technically
     * it's an error, but it's harmless to accept without complaining. Let's
     * call it "undefined" behavior at the specification level and patch things
     * up silently. */
    cap(p.hi >>> 0, fresh);
    arena.zero(stale, 8);
  } else if (fresh.segment.id === p.object.segment.id) {
    (p.typeBits: 0x00 | 0x01);
    if (p.typeBits === 0x00 && p.hi === 0x00000000) {
      emptyStruct(fresh);
    } else {
      /* Pointer `fresh` is on the same segment as the target object. Write the
       * non-far pointer at pointer `fresh`. */
      const lo = p.typeBits | (p.object.position - (fresh.position + 8)) / 2;
      encode(lo, fresh.segment.raw, fresh.position);
      encode(p.hi, fresh.segment.raw, fresh.position+4);
    }
    /* Based on the distinctness precondition and how pointer `fresh` is local
     * to the targeted object, I conclude that pointer `stale` is a far pointer.
     * Double-hop far pointers should be rare, so I'm not going to bother zero-
     * filling the intermediate data. I can't imagine that there's a security
     * problem, and I can't imagine that two words of garbage per double-hop
     * pointer is a problem. */
    arena.zero(stale, 8);
  } else if (stale.segment.id === p.object.segment.id) {
    (p.typeBits: 0x00 | 0x01);
    if (p.typeBits === 0x00 && p.hi === 0x00000000) {
      emptyStruct(fresh);
      arena.zero(stale, 8);
    } else {
      /* Pointer `stale` is local to the targeted object. This and the
       * distinctness precondition imply that pointer `fresh` is non-local to
       * the targeted object object (i.e. a far pointer). Use pointer `stale` as
       * a single-hop landing pad for pointer `fresh`. */
      singleHop(fresh, stale);
    }
  } else {
    (p.typeBits: 0x00 | 0x01);
    if (p.typeBits === 0x00 && p.hi === 0x00000000) {
      emptyStruct(fresh);
    } else {
      /* Pointers `stale` and `fresh` are both non-local to the targeted object.
       * A verbatim copy of the far pointer encoded at `stale` will point at the
       * targeted object, so just copy it. */
      arena.write(stale, 8, fresh);
    }
    arena.zero(stale, 8);
  }
}
