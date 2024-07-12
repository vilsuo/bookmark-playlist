import { describe, expect, test } from "@jest/globals";
import { createDefaultQueueRootState } from "../../../test/state";
import { renderWithProviders } from "../../../test/render";
import QueueTable from "./QueueTable";
import { albums } from "../../../test/constants";
import { fireEvent, screen, within } from "@testing-library/dom";
import { selectPlaying } from "../../redux/reducers/albums/albumsSlice";
import { selectIsQueued, selectQueueFirst } from "../../redux/reducers/queueSlice";
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

  test("should display all queued albums in order", () => {
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

    test("should not display the album after playing it", () => {
      const preloadedState = createTestState(queue);
      renderWithProviders(<QueueTable />, { preloadedState });
  
      const rowBefore = queryQueueTableRowByText(albumToBePlayed.title);
      expect(rowBefore).toBeInTheDocument();

      fireEvent.click(within(rowBefore!).getByTestId("play-queue"));
  
      const rowAfter = queryQueueTableRowByText(albumToBePlayed.title);
      expect(rowAfter).not.toBeInTheDocument();
    });

    test("should remove the album from the queue", () => {
      const preloadedState = createTestState(queue);
      const { store } = renderWithProviders(<QueueTable />, { preloadedState });
  
      const rowBefore = queryQueueTableRowByText(albumToBePlayed.title);
      fireEvent.click(within(rowBefore!).getByTestId("play-queue"));
  
      expect(selectIsQueued(store.getState(), albumToBePlayed.id)).toBe(false);
    });

    test("should shift the other albums to take the played albums place", () => {
      const preloadedState = createTestState(queue);
      renderWithProviders(<QueueTable />, { preloadedState });
  
      const row = queryQueueTableRowByText(albumToBePlayed.title);
      fireEvent.click(within(row!).getByTestId("play-queue"));
  
      const rowsAfter = queryAllQueueTableRows();
      expect(rowsAfter).toHaveLength(queue.length - 1);
      rowsAfter.forEach((row, i) => {
        if (i < playedIdx) {
          // earlier albums keep their place
          expect(row).toHaveTextContent(queue[i].title);
        } else {
          // later albums are shifted one position up
          expect(row).toHaveTextContent(queue[i + 1].title);
        }
      });
    });

    test("should set the album as played", () => {
      const preloadedState = createTestState(queue);
      const { store } = renderWithProviders(<QueueTable />, { preloadedState });
  
      const row = queryQueueTableRowByText(albumToBePlayed.title);
      fireEvent.click(within(row!).getByTestId("play-queue"));
  
      expect(selectPlaying(store.getState())).toStrictEqual(albumToBePlayed);
    });
  });

  describe("removing", () => {
    const removedIdx = 1;
    const albumToBeRemoved = queue[removedIdx];

    test("should not display the album after removing it", () => {
      const preloadedState = createTestState(queue);
      renderWithProviders(<QueueTable />, { preloadedState });

      const rowBefore = queryQueueTableRowByText(albumToBeRemoved.title);
      fireEvent.click(within(rowBefore!).getByTestId("remove-queue"));

      const rowAfter = queryQueueTableRowByText(albumToBeRemoved.title);
      expect(rowAfter).not.toBeInTheDocument();
    });

    test("should remove album from the queue", () => {
      const preloadedState = createTestState(queue);
      const { store } = renderWithProviders(<QueueTable />, { preloadedState });
  
      const row = queryQueueTableRowByText(albumToBeRemoved.title);
      fireEvent.click(within(row!).getByTestId("remove-queue"));
  
      expect(selectIsQueued(store.getState(), albumToBeRemoved.id)).toBe(false);
    });

    test("should shift the other albums to take the removed albums place", () => {
      const preloadedState = createTestState(queue);
      renderWithProviders(<QueueTable />, { preloadedState });

      const row = queryQueueTableRowByText(albumToBeRemoved.title);
      fireEvent.click(within(row!).getByTestId("remove-queue"));

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
  });

  describe("prepending", () => {
    const prependIdx = 1;
    const albumToBePrepended = queue[prependIdx];

    test("should display the album after prepending it", () => {
      const preloadedState = createTestState(queue);
      renderWithProviders(<QueueTable />, { preloadedState });

      const rowBefore = queryQueueTableRowByText(albumToBePrepended.title);
      fireEvent.click(within(rowBefore!).getByTestId("prepend-queue"));

      const rowAfter = queryQueueTableRowByText(albumToBePrepended.title);
      expect(rowAfter).toBeInTheDocument();
    });

    test("should move the prepended album to the first place in the queue", () => {
      const preloadedState = createTestState(queue);
      const { store } = renderWithProviders(<QueueTable />, { preloadedState });

      const row = queryQueueTableRowByText(albumToBePrepended.title);
      fireEvent.click(within(row!).getByTestId("prepend-queue"));

      const rowAfter = queryQueueTableRowByText(albumToBePrepended.title);
      expect(rowAfter).toBeInTheDocument();

      expect(queryAllQueueTableRows()[0]).toHaveTextContent(albumToBePrepended.title);
      expect(selectQueueFirst(store.getState())).toStrictEqual(albumToBePrepended);
    });

    test("should shift the other albums after the prepended album in the queue", () => {
      const preloadedState = createTestState(queue);
      renderWithProviders(<QueueTable />, { preloadedState });
  
      const row = queryAllQueueTableRows()[prependIdx];
      fireEvent.click(within(row).getByTestId("prepend-queue"));
  
      const rowsAfter = queryAllQueueTableRows();
      expect(rowsAfter).toHaveLength(queue.length);
      rowsAfter.forEach((row, i) => {
        if (0 < i && i <= prependIdx) {
          // earlier albums are shifted one down
          expect(row).toHaveTextContent(queue[i - 1].title);
        } else if (i > prependIdx) {
          // later albums keep their place
          expect(row).toHaveTextContent(queue[i].title);
        }
      });
    });
  });
});
