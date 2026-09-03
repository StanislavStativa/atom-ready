import { Text } from "@sitecore-content-sdk/nextjs";
import { TextFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";
import {useRef, useEffect} from 'react';

export const TextAtom = ({ props }: { props: { text: TextFieldSchema } }) => {
  // test code to be reverted
  const { text } = props;
  const compRef = useRef<null | HTMLDivElement>(null)
  const id = useRef<string | null>(null)

  useEffect(()=>{
    id.current = window.crypto.randomUUID()
  },[])
  
  useEffect(() => {
    if (!compRef.current || !id.current) return;
    
      const sibling = compRef.current.previousElementSibling

      if (sibling?.tagName.toLowerCase() === 'code') 
        sibling.setAttribute('data-atom-id', id.current);
  }, [compRef.current, id.current]);
      

  return <Text field={text} editable={true} ref={compRef}/>;
};