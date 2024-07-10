import { describe, expect, test } from "@jest/globals";
import { createDefaultQueueRootState } from "../../../test/state";
import { renderWithProviders } from "../../../test/render";
import QueueTable from "./QueueTable";
import { albums } from "../../../test/constants";
import { fireEvent, screen, within } from "@testing-library/dom";
import { selectPlaying } from "../../redux/reducers/albums/albumsSlice";
import { selectIsQueued } from "../../redux/reducers/queueSlice";
import { Album } from "../../types";

const createTestState = (queue: Album[] = []) =>
  createDefaultQueueRootState({ queue });

const queryAllQueueTableRows = () => {
  const queueTableBody = screen.getByTestId("queue-tbody");
  return within(queueTableBody).queryAllByRole("row");
};

const queryQueueTableRowByText = (text: string) => {
  const queueTableBody = screen.getByTestId("queue-tbody");
  return within(queueTableBody).queryByRole("row", { name: new RegExp(text) });
};

describe("<QueueTable />", () => {
  const [nonQueuedAlbum, ...queue] = albums;

  test("should display all queued albums", () => {
    const preloadedState = createTestState(queue);
    renderWithProviders(<QueueTable />, { preloadedState });

    const rows = queryAllQueueTableRows();
    expect(rows).toHaveLength(queue.length);

    queue.forEach((q, i) => {
      const row = rows[i]; // correct index
      expect(row).toHaveTextContent(q.artist)
      expect(row).toHaveTextContent(q.title);
    });
  });

  test("should not display a non queued album", () => {
    const preloadedState = createTestState(queue);
    renderWithProviders(<QueueTable />, { preloadedState });

    expect(queryQueueTableRowByText(nonQueuedAlbum.title))
      .not.toBeInTheDocument();
  });

  describe("playing", () => {
    const playedIdx = 1;
    const albumToBePlayed = queue[playedIdx];

    test("should not display album after playing it", () => {
      const preloadedState = createTestState(queue);
      renderWithProviders(<QueueTable />, { preloadedState });
  
      const rowBefore = queryAllQueueTableRows()[playedIdx];
      expect(rowBefore).toHaveTextContent(albumToBePlayed.title);
  
      fireEvent.click(within(rowBefore).getByTestId("play-queue"));
  
      expect(rowBefore).not.toBeInTheDocument();
  
      const rowsAfter = queryAllQueueTableRows();
      expect(rowsAfter).toHaveLength(queue.length - 1);
      rowsAfter.forEach((row, i) => {
        if (i < playedIdx) {
          // earlier albums keep their place
          expect(row).toHaveTextContent(queue[i].title);
        } else {
          // later albums are shifted one down
          expect(row).toHaveTextContent(queue[i + 1].title);
        }
      });
    });

    test("should set album to be played", () => {
      const preloadedState = createTestState(queue);
      const { store } = renderWithProviders(<QueueTable />, { preloadedState });
  
      const rowBefore = queryAllQueueTableRows()[playedIdx];
      expect(rowBefore).toHaveTextContent(albumToBePlayed.title);
  
      fireEvent.click(within(rowBefore).getByTestId("play-queue"));
  
      expect(selectPlaying(store.getState())).toStrictEqual(albumToBePlayed);
    });
  });

  describe("removing", () => {
    const removedIdx = 1;
    const albumToBeRemoved = queue[removedIdx];

    test("should not display an album removed from the queue", () => {
      const preloadedState = createTestState(queue);
      renderWithProviders(<QueueTable />, { preloadedState });

      const rowBefore = queryAllQueueTableRows()[removedIdx];
      expect(rowBefore).toHaveTextContent(albumToBeRemoved.title);

      fireEvent.click(within(rowBefore).getByTestId("remove-queue"));

      expect(rowBefore).not.toBeInTheDocument();

      const rowsAfter = queryAllQueueTableRows();
      expect(rowsAfter).toHaveLength(queue.length - 1);
      rowsAfter.forEach((row, i) => {
        if (i < removedIdx) {
          // earlier albums keep their place
          expect(row).toHaveTextContent(queue[i].title);
        } else {
          // later albums are shifted one down
          expect(row).toHaveTextContent(queue[i + 1].title);
        }
      });
    });

    test("should remove album from the queue", () => {
      const preloadedState = createTestState(queue);
      const { store } = renderWithProviders(<QueueTable />, { preloadedState });
  
      const rowBefore = queryAllQueueTableRows()[removedIdx];
      expect(rowBefore).toHaveTextContent(albumToBeRemoved.title);
  
      fireEvent.click(within(rowBefore).getByTestId("remove-queue"));
  
      expect(selectIsQueued(store.getState(), albumToBeRemoved.id)).toBe(false);
    });
  });

  test("should move the prepended album to the first place in the queue", () => {
    const preloadedState = createTestState(queue);
    renderWithProviders(<QueueTable />, { preloadedState });

    const startIdx = 1;
    const albumToBePrepended = queue[startIdx];

    const rowBefore = queryAllQueueTableRows()[startIdx];
    expect(rowBefore).toHaveTextContent(albumToBePrepended.title);

    fireEvent.click(within(rowBefore).getByTestId("prepend-queue"));

    const rowsAfter = queryAllQueueTableRows();
    expect(rowsAfter).toHaveLength(queue.length);
    rowsAfter.forEach((row, i) => {
      if (i === 0) {
        expect(row).toHaveTextContent(albumToBePrepended.title);
      } else if (i <= startIdx) {
        // earlier albums are shifted one down
        expect(row).toHaveTextContent(queue[i - 1].title);
      } else {
        // later albums keep their place
        expect(row).toHaveTextContent(queue[i].title);
      }
    });
  });
});
