import { RichText } from "@sitecore-content-sdk/nextjs";
import type { RichTextFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";

export const RichTextAtom = ({
  props,
}: {
  props: { richText: RichTextFieldSchema };
}) => {
  const { richText } = props;
  return <RichText field={richText} editable={true} />;
};
