import { z } from "zod";

export const emptyItemPropsSchema = z.object({});

export type EmptyItemProps = z.infer<typeof emptyItemPropsSchema>;

export const emptyItemCatalogEntry = {
  props: emptyItemPropsSchema,
  description:
    "Placeholder for an unfilled SuperLayout column/row slot, giving the editor a droppable area with chrome. Unstyled here; styling is handled by whatever reads the chrome. Gets replaced in the Document once a real atom is dropped into that slot.",
  allowedParents: ["SuperLayout"],
};

export const EmptyItem = () => <div className="sc-empty-item" />;
