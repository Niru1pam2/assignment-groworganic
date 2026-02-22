import { useState } from "react";
import type { Artwork } from "~/types";

export function useInputSelection(artworks: Artwork[], currentPage: number) {
  const [selectedArtworksIds, setSelectedArtworksIds] = useState<Set<number>>(
    new Set(),
  );
  const [deselectedArtworksIds, setDeselectedArtworksIds] = useState<
    Set<number>
  >(new Set());
  const [inputSelectedRows, setInputSelectedRows] = useState<number>(0);

  const currentlySelected = artworks.filter((artwork, idx) => {
    const activeIndex = (currentPage - 1) * 12 + idx;
    const isinBound = activeIndex < inputSelectedRows;

    if (isinBound) {
      return !deselectedArtworksIds.has(artwork.id);
    } else {
      return selectedArtworksIds.has(artwork.id);
    }
  });

  const handleSubmit = (input: number) => {
    setInputSelectedRows(input);
    setSelectedArtworksIds(new Set());
    setDeselectedArtworksIds(new Set());
  };

  const handleSelectionChange = (newlySelected: Artwork[]) => {
    const newlySelectedIds = new Set(newlySelected.map((n) => n.id));

    const toAddSelected = new Set<number>();
    const toRemoveSelected = new Set<number>();
    const toAddDeselected = new Set<number>();
    const toRemoveDeselected = new Set<number>();

    artworks.forEach((artwork, idx) => {
      const activeIndex = (currentPage - 1) * 12 + idx;
      const isinBound = activeIndex < inputSelectedRows;
      const userChecked = newlySelectedIds.has(artwork.id);

      if (isinBound) {
        if (userChecked) {
          toRemoveDeselected.add(artwork.id);
        } else {
          toAddDeselected.add(artwork.id);
        }
      } else {
        if (userChecked) {
          toAddSelected.add(artwork.id);
        } else {
          toRemoveSelected.add(artwork.id);
        }
      }
    });

    setSelectedArtworksIds((prev) => {
      const nextSet = new Set(prev);
      toAddSelected.forEach((id) => nextSet.add(id));
      toRemoveSelected.forEach((id) => nextSet.delete(id));
      return nextSet;
    });

    setDeselectedArtworksIds((prev) => {
      const nextSet = new Set(prev);
      toAddDeselected.forEach((id) => nextSet.add(id));
      toRemoveDeselected.forEach((id) => nextSet.delete(id));
      return nextSet;
    });
  };

  return {
    currentlySelected,
    inputSelectedRows,
    selectedArtworksIds,
    deselectedArtworksIds,
    handleSubmit,
    handleSelectionChange,
  };
}
