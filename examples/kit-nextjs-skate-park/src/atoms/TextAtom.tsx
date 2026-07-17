import { Text } from "@sitecore-content-sdk/nextjs";
import { TextFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";

export const TextAtom = ({ props }: { props: { text: TextFieldSchema } }) => {
  const { text } = props;
  return <Text field={text} editable={true} />;
};
