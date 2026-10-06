import { File } from "@sitecore-content-sdk/nextjs";
import type { FileFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";

export const FileAtom = ({ props }: { props: { file: FileFieldSchema } }) => {
  const { file } = props;
  return <File field={file} />;
};
