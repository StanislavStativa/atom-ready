import { shadcnComponents } from "@json-render/shadcn";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";
import {
  dateFieldSchema,
  defineAtomsCatalog,
  defineAtomsRegistry,
  fileFieldSchema,
  imageFieldSchema,
  linkFieldSchema,
  richTextFieldSchema,
  textFieldSchema,
} from "@sitecore-content-sdk/nextjs/atoms";
import { TextAtom } from "src/atoms/TextAtom";
import {
  customAtomActions,
  customAtomActionsDefinitions,
} from "src/atoms/registry-actions";
import { z } from "zod";
import { DateAtom } from "./DateAtom";
import { EmptyItem, emptyItemCatalogEntry } from "./EmptyItem";
import { FileAtom } from "./FileAtom";
import { ImageAtom } from "./ImageAtom";
import { LinkAtom } from "./LinkAtom";
import { RichTextAtom } from "./RichTextAtom";
import { SuperLayout, superLayoutCatalogEntry } from "./SuperLayout";

export const catalog = defineAtomsCatalog({
  version: "1.0.1",
  components: {
    SuperLayout: superLayoutCatalogEntry,
    EmptyItem: emptyItemCatalogEntry,
    Card: {
      ...shadcnComponentDefinitions.Card,
      props: shadcnComponentDefinitions.Card.props.omit({ className: true }),
    },
    Stack: {
      ...shadcnComponentDefinitions.Stack,
      props: shadcnComponentDefinitions.Stack.props.omit({ className: true }),
    },
    Grid: {
      ...shadcnComponentDefinitions.Grid,
      props: shadcnComponentDefinitions.Grid.props.omit({ className: true }),
    },
    Separator: shadcnComponentDefinitions.Separator,
    Tabs: shadcnComponentDefinitions.Tabs,
    Accordion: shadcnComponentDefinitions.Accordion,
    Collapsible: shadcnComponentDefinitions.Collapsible,
    Dialog: shadcnComponentDefinitions.Dialog,
    Drawer: shadcnComponentDefinitions.Drawer,
    Carousel: shadcnComponentDefinitions.Carousel,
    Table: shadcnComponentDefinitions.Table,
    Heading: shadcnComponentDefinitions.Heading,
    Text: {
      props: z.object({
        text: textFieldSchema(),
      }),
      description:
        "Displays a Sitecore single-line text field with inline editing support.",
      example: {
        text: { value: "Sample text" },
      },
    },
    RichText: {
      props: z.object({
        richText: richTextFieldSchema(),
      }),
      description:
        "Displays a Sitecore rich text field with inline editing support.",
      example: {
        richText: { value: "<p>Sample rich text</p>" },
      },
    },
    Date: {
      props: z.object({
        date: dateFieldSchema(),
      }),
      description:
        "Displays a Sitecore date field with inline editing support.",
      example: {
        date: { value: "2026-10-05T00:00:00Z" },
      },
    },
    File: {
      props: z.object({
        file: fileFieldSchema(),
      }),
      description:
        "Displays a download link for a Sitecore file field using its title or display name.",
      example: {
        file: { value: { src: "/sample.pdf", title: "Download file" } },
      },
    },
    Image: {
      props: z.object({
        image: imageFieldSchema(),
      }),
      description:
        "Displays an optimized Sitecore image field with inline editing support. Provide image width and height in the field value.",
      example: {
        image: {
          value: {
            src: "/sample-image.jpg",
            alt: "Sample image",
            width: 800,
            height: 600,
          },
        },
      },
    },
    Avatar: shadcnComponentDefinitions.Avatar,
    Badge: shadcnComponentDefinitions.Badge,
    Alert: shadcnComponentDefinitions.Alert,
    Progress: shadcnComponentDefinitions.Progress,
    Skeleton: shadcnComponentDefinitions.Skeleton,
    Spinner: shadcnComponentDefinitions.Spinner,
    Tooltip: shadcnComponentDefinitions.Tooltip,
    Popover: shadcnComponentDefinitions.Popover,
    Input: shadcnComponentDefinitions.Input,
    Textarea: shadcnComponentDefinitions.Textarea,
    Select: shadcnComponentDefinitions.Select,
    Checkbox: shadcnComponentDefinitions.Checkbox,
    Radio: shadcnComponentDefinitions.Radio,
    Switch: shadcnComponentDefinitions.Switch,
    Slider: shadcnComponentDefinitions.Slider,
    Button: shadcnComponentDefinitions.Button,
    Link: {
      props: z.object({
        link: linkFieldSchema(),
      }),
      description:
        "Displays a Sitecore general link field with inline editing support.",
      example: {
        link: { value: { href: "/", text: "Home" } },
      },
    },
    DropdownMenu: shadcnComponentDefinitions.DropdownMenu,
    Toggle: shadcnComponentDefinitions.Toggle,
    ToggleGroup: shadcnComponentDefinitions.ToggleGroup,
    ButtonGroup: shadcnComponentDefinitions.ButtonGroup,
    Pagination: shadcnComponentDefinitions.Pagination,
  },
  actions: customAtomActionsDefinitions,
});

export const registry = defineAtomsRegistry(catalog, {
  components: {
    SuperLayout,
    EmptyItem,
    Card: shadcnComponents.Card,
    Stack: shadcnComponents.Stack,
    Grid: shadcnComponents.Grid,
    Separator: shadcnComponents.Separator,
    Tabs: shadcnComponents.Tabs,
    Accordion: shadcnComponents.Accordion,
    Collapsible: shadcnComponents.Collapsible,
    Dialog: shadcnComponents.Dialog,
    Drawer: shadcnComponents.Drawer,
    Carousel: shadcnComponents.Carousel,
    Table: shadcnComponents.Table,
    Heading: shadcnComponents.Heading,
    Text: TextAtom,
    RichText: RichTextAtom,
    Date: DateAtom,
    File: FileAtom,
    Image: ImageAtom,
    Avatar: shadcnComponents.Avatar,
    Badge: shadcnComponents.Badge,
    Alert: shadcnComponents.Alert,
    Progress: shadcnComponents.Progress,
    Skeleton: shadcnComponents.Skeleton,
    Spinner: shadcnComponents.Spinner,
    Tooltip: shadcnComponents.Tooltip,
    Popover: shadcnComponents.Popover,
    Input: shadcnComponents.Input,
    Textarea: shadcnComponents.Textarea,
    Select: shadcnComponents.Select,
    Checkbox: shadcnComponents.Checkbox,
    Radio: shadcnComponents.Radio,
    Switch: shadcnComponents.Switch,
    Slider: shadcnComponents.Slider,
    Button: shadcnComponents.Button,
    Link: LinkAtom,
    DropdownMenu: shadcnComponents.DropdownMenu,
    Toggle: shadcnComponents.Toggle,
    ToggleGroup: shadcnComponents.ToggleGroup,
    ButtonGroup: shadcnComponents.ButtonGroup,
    Pagination: shadcnComponents.Pagination,
  },
  actions: customAtomActions,
});
