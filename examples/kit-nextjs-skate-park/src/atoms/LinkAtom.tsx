import { Link } from "@sitecore-content-sdk/nextjs";
import type { LinkFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";

export const LinkAtom = ({ props }: { props: { link: LinkFieldSchema } }) => {
  const { link } = props;
  return <Link field={link} editable={true} />;
};
