import MockDiscord from "../mocks/mockDiscord";
import { CordeRole } from "../../src/structures/cordeRole";
import { RolePermission } from "../../src/utils";

const mockDiscord = new MockDiscord();
const role = mockDiscord.role;
const cordeRole = new CordeRole(role);

describe("testing cordeRole", () => {
  it("ids should match", () => {
    expect(cordeRole.id).toEqual(role.id);
  });

  it("colors should match", () => {
    expect(cordeRole.color).toEqual(role.color);
  });

  it("createdAt should match", () => {
    expect(cordeRole.createdAt).toEqual(role.createdAt);
  });

  it("hexColor should match", () => {
    expect(cordeRole.hexColor).toEqual(role.hexColor);
  });

  it("isDeleted should match", () => {
    expect(cordeRole.isDeleted).toEqual(role.deleted);
  });

  it("isEditable should match", () => {
    expect(cordeRole.isEditable).toEqual(role.editable);
  });

  it("isHoist should match", () => {
    expect(cordeRole.isHoist).toEqual(role.hoist);
  });

  it("isManaged should match", () => {
    expect(cordeRole.isManaged).toEqual(role.managed);
  });

  it("isMentionable should match", () => {
    expect(cordeRole.isMentionable).toEqual(role.mentionable);
  });

  it("name should match", () => {
    expect(cordeRole.name).toEqual(role.name);
  });

  it("position should match", () => {
    expect(cordeRole.position).toEqual(role.rawPosition);
  });

  it("should call original setName", async () => {
    const setNameMock = jest.spyOn(role, "setName").mockImplementation(() => Promise.resolve(role));

    const newName = "batata";
    await cordeRole.updateName(newName);
    expect(setNameMock).toHaveBeenCalledTimes(1);
    expect(setNameMock).toHaveBeenCalledWith(newName);
  });

  it("should call original setPosition", async () => {
    const setPositionMock = jest
      .spyOn(role, "setPosition")
      .mockImplementation(() => Promise.resolve(role));

    const newPosition = 2;
    await cordeRole.updatePosition(newPosition);
    expect(setPositionMock).toHaveBeenCalledTimes(1);
    expect(setPositionMock).toHaveBeenCalledWith(newPosition);
  });

  it("should call original setMentionable", async () => {
    const setMentionableMock = jest
      .spyOn(role, "setMentionable")
      .mockImplementation(() => Promise.resolve(role));

    const newMentionable = true;
    await cordeRole.updateMentionable(newMentionable);
    expect(setMentionableMock).toHaveBeenCalledTimes(1);
    expect(setMentionableMock).toHaveBeenCalledWith(newMentionable);
  });

  it("should call original edit", async () => {
    const editMock = jest.spyOn(role, "edit").mockImplementation(() => Promise.resolve(role));

    await cordeRole.update({ name: "test" });
    expect(editMock).toHaveBeenCalledTimes(1);
  });

  it("should call original setHoist", async () => {
    const setHoistMock = jest
      .spyOn(role, "setHoist")
      .mockImplementation(() => Promise.resolve(role));

    const newHoist = true;
    await cordeRole.updateHoist(newHoist);
    expect(setHoistMock).toHaveBeenCalledTimes(1);
    expect(setHoistMock).toHaveBeenCalledWith(newHoist);
  });

  it("should call original setColor", async () => {
    const setColorMock = jest
      .spyOn(role, "setColor")
      .mockImplementation(() => Promise.resolve(role));

    const newColor = "#fff";
    await cordeRole.updateColor(newColor);
    expect(setColorMock).toHaveBeenCalledTimes(1);
    // Resolved color
    expect(setColorMock).toHaveBeenCalledWith(4095);
  });

  it("shouldn't do anything due to no data passed", async () => {
    const editMock = jest.spyOn(role, "edit");
    await cordeRole.update(null);
    expect(editMock).not.toBeCalled();
  });

  it("should call original setPermissions", async () => {
    const setPermissionsMock = jest
      .spyOn(role, "setPermissions")
      .mockImplementation(() => Promise.resolve(role));

    const newPermitions: RolePermission = "BAN_MEMBERS";
    await cordeRole.updatePermissions(newPermitions);
    expect(setPermissionsMock).toHaveBeenCalledTimes(1);
    expect(setPermissionsMock).toHaveBeenCalledWith([newPermitions]);
  });

  it("should call original delete", async () => {
    const deleteMock = jest.spyOn(role, "delete").mockImplementation(() => null);

    await cordeRole.delete();
    expect(deleteMock).toHaveBeenCalledTimes(1);
  });
});
