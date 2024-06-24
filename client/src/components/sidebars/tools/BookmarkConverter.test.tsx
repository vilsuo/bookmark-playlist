import { afterAll, afterEach, beforeAll, describe, expect, test } from "@jest/globals";
import userEvent, { UserEvent } from '@testing-library/user-event';
import { fireEvent, screen } from "@testing-library/dom";

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { renderWithProviders } from "../../../redux/testUtils";
import { findInputByLabelMatcher } from "../../../../test/helpers";

import BookmarkConverter from "./BookmarkConverter";
import { Album } from "../../../types";
import { BASE_URL } from "../../../util/converterService";

const findBookmarkInput = async () => findInputByLabelMatcher(/Root folder/i);
const findUploadInput = async () => findInputByLabelMatcher(/Attachment/i);
const getConvertButton = () => screen.getByRole("button", { name: /Convert/i });

const typeBookmarkNameToInput = async (user: UserEvent, value: string) =>
  user.type(await findBookmarkInput(), value);

const uploadFileToInput = async (user: UserEvent, file: File) =>
  user.upload(await findUploadInput(), file);

describe("<BookmarkConverter />", () => {
  const testBookmarkName = "My_bookmarks";
  const testFile = new File(['<html></html>'], "test.html", { type: "text/html" });

  const album: Album = {
    id: 1841,
    videoId: "JMAbKMSuVfI",
    artist: "Massacra",
    title: "Signs of the Decline",
    published: 1992,
    category: "Death",
    addDate: "2022-06-20T11:22:04.000Z"
  };

  const handlers = [
    http.post(BASE_URL, async () => {
      console.log("Intercepted!");
      return HttpResponse.json([album]);
    }),
  ];

  const server = setupServer(...handlers);

  // Enable API mocking before tests.
  beforeAll(() => server.listen());

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  test("Can input a bookmarks folder name", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookmarkConverter />);

    await typeBookmarkNameToInput(user, testBookmarkName);

    expect(await findBookmarkInput()).toHaveDisplayValue(testBookmarkName);

    expect(getConvertButton()).toHaveProperty("disabled", true);
  });

  test("Can input a file", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookmarkConverter />);

    await uploadFileToInput(user, testFile);

    const input = await findUploadInput();
    expect(input.files![0]).toBe(testFile);
    expect(input.files).toHaveLength(1);

    expect(getConvertButton()).toHaveProperty("disabled", true);
  });

  test.only("Can convert bookmarks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookmarkConverter />);

    await typeBookmarkNameToInput(user, testBookmarkName);
    await uploadFileToInput(user, testFile);

    expect(getConvertButton()).toHaveProperty("disabled", false);

    // https://github.com/testing-library/user-event/issues/1032
    fireEvent.submit(getConvertButton());
  });
});
