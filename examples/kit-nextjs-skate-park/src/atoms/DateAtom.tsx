import { DateField } from "@sitecore-content-sdk/nextjs";
import type { DateFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";

export const DateAtom = ({ props }: { props: { date: DateFieldSchema } }) => {
  const { date } = props;
  return <DateField field={date} editable={true} />;
};
