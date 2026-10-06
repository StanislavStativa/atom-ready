import { NextImage } from "@sitecore-content-sdk/nextjs";
import type { ImageFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";

export const ImageAtom = ({
  props,
}: {
  props: { image: ImageFieldSchema };
}) => {
  const { image } = props;
  return <NextImage field={image} editable={true} />;
};
