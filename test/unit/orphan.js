import * as assert from "assert";
import { describe, it } from "mocha";

//TODO: Re-export Unlimited in this package's index?
import { Unlimited } from "@capnp-js/base-arena";
import { Builder } from "@capnp-js/builder-arena";
import {
  Orphan,
  Text,
  UInt8List,
  AnyValue,
  StructValue,
  ListValue,
} from "../../src/index";
import { root } from "@capnp-js/memory";
import { PointerTypeError } from "@capnp-js/internal-error";
import { AdoptNonorphanError } from "@capnp-js/programmer-error";

import * as reader from "../generic/schema.capnp-r";
import * as builder from "../generic/schema.capnp-b";

/* The `nonpreallocated` unit tests capture single-hop and double-hop far
   pointers, so no need to repeat that work here. */

describe("Orphan structs", function () {
  const arena = Builder.fresh(32, new Unlimited());
  const object = arena.allocate(32);
  const p = {
    typeBits: 0x00,
    hi: (0x03<<16) | 0x01,
    object,
  };

  describe(".adopt", function () {
    it("rejects orphans that have been adopted", function () {
      const orphan = new Orphan(builder.Trivial, arena, p);
      assert.ok(orphan.isDetached());
      orphan.guts.adopt(arena, root(arena));
      assert.ok(!orphan.isDetached());
      assert.deepEqual(arena.pointer(root(arena)), p);
      assert.throws(() => {
        orphan.guts.adopt(arena, root(arena));
      }, AdoptNonorphanError);
    });
  });

  describe("move Trivial struct", function () {
    const arena = Builder.fresh(2048, new Unlimited());
    const SN = builder.FirstNongeneric.FirstGeneric.specialize(Text, StructValue).SecondNongeneric;
    const SG = SN.SecondGeneric.specialize(builder.Trivial);
    const sg = arena.initRoot(SG);
    let trivial = arena.initStruct(builder.Trivial);

    it("casts to StructValue and back", function () {
      assert.ok(trivial.isDetached());
      const struct = StructValue.seizeOrphan(trivial);
      assert.ok(!trivial.isDetached());
      assert.ok(struct.isDetached());
      //TODO: Rename `move` to `cast`(?)
      trivial = struct.move(builder.Trivial);
      assert.ok(trivial.isDetached());
      assert.ok(!struct.isDetached());
    });

    it("casts to AnyValue and back", function () {
      assert.ok(trivial.isDetached());
      const any = AnyValue.seizeOrphan(trivial);
      assert.ok(!trivial.isDetached());
      assert.ok(any.isDetached());
      //TODO: Rename `move` to `cast`(?)
      trivial = any.move(builder.Trivial);
      assert.ok(trivial.isDetached());
      assert.ok(!any.isDetached());
    });

    it("casts to AnyValue, but not back to a list", function () {
      assert.ok(trivial.isDetached());
      const any = AnyValue.seizeOrphan(trivial);
      assert.ok(!trivial.isDetached());
      assert.ok(any.isDetached());
      //TODO: Rename `move` to `cast`(?)
      assert.throws(() => {
        any.move(UInt8List);
      });
    });
  });
});

describe("Orphan lists", function () {
  const arena = Builder.fresh(32, new Unlimited());
  const object = arena.allocate(16);
  const p = {
    typeBits: 0x01,
    hi: (5<<3) | 0x02,
    object,
  };

  describe(".adopt", function () {
    it("rejects orphans that have been adopted", function () {
      const orphan = new Orphan(UInt8List, arena, p);
      assert.ok(orphan.isDetached());
      orphan.guts.adopt(arena, root(arena));
      assert.ok(!orphan.isDetached());
      assert.deepEqual(arena.pointer(root(arena)), p);
      assert.throws(() => {
        orphan.guts.adopt(arena, root(arena));
      }, AdoptNonorphanError);
    });
  });

  describe("move UInt8List", function () {
    const arena = Builder.fresh(2048, new Unlimited());
    const SN = builder.FirstNongeneric.FirstGeneric.specialize(Text, ListValue).SecondNongeneric;
    const SG = SN.SecondGeneric.specialize(Text);
    const sg = arena.initRoot(SG);
    let text = arena.initText("An inoffensive string");

    it("casts to ListValue and back", function () {
      assert.ok(text.isDetached());
      const list = ListValue.seizeOrphan(text);
      assert.ok(!text.isDetached());
      assert.ok(list.isDetached());
      text = list.move(Text);
      assert.ok(text.isDetached());
      assert.ok(!list.isDetached());
    });

    it("casts to AnyValue and back", function () {
      assert.ok(text.isDetached());
      const any = AnyValue.seizeOrphan(text);
      assert.ok(!text.isDetached());
      assert.ok(any.isDetached());
      //TODO: Rename `move` to `cast`(?)
      text = any.move(Text);
      assert.ok(text.isDetached());
      assert.ok(!any.isDetached());
    });

    it("casts to AnyValue, but not back to a struct", function () {
      assert.ok(text.isDetached());
      const any = AnyValue.seizeOrphan(text);
      assert.ok(!text.isDetached());
      assert.ok(any.isDetached());
      //TODO: Rename `move` to `cast`(?)
      assert.throws(() => {
        any.move(builder.Trivial);
      });
    });
  });
});

/* TODO: implement a Capability wrapper. The RPC layer should drive its implementation, so no tests for now.
test("adopt capability", t => {
  t.plan(5);

  const arena = new Builder(32);
  const object = arena.allocate(0);
  const p = {
    typeBits: 0x03,
    hi: 0x12345678,
    object,
  };
  const orphan = new Orphan(arena, p);
  t.true(orphan.isDetached());
  orphan.guts.adopt(arena, root(arena));
  t.false(orphan.isDetached());
  const q = arena.pointer(root(arena));
  t.is(q.typeBits, 0x03);
  t.is(q.hi, 0x12345678);
  throwsAdoptNonorphan(orphan, t, arena);
});
*/
