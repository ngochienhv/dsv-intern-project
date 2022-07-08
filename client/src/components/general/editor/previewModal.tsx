import {
    Button,
    Divider,
    Grid,
    Group,
    Image,
    Modal,
    Space,
    Textarea,
    Title,
    Text,
    TextInput,
    Badge,
    ActionIcon,
} from "@mantine/core";
import React, { Dispatch, SetStateAction } from "react";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import ImgDropzone from "../others/imgDropzone";
import { Article } from "../../user/editPost";
import Notifications from "../others/notification";
import { X } from "tabler-icons-react";
import axios from "axios";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    form: UseForm<Article>;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
};

function toDataURL(
    image: React.MutableRefObject<HTMLImageElement>,
    callback: (dataURL: string) => void
) {
    image.current.crossOrigin = "Anonymous";
    image.current.onload = function () {
        var canvas = document.createElement("canvas");
        var max_size = 544;
        var width = image.current.width;
        var height = image.current.height;
        if (width > height) {
            if (width > max_size) {
                height *= max_size / width;
                width = max_size;
            }
        } else {
            if (height > max_size) {
                width *= max_size / height;
                height = max_size;
            }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        var dataURL;
        ctx!.drawImage(image.current, 0, 0, width, height);
        dataURL = canvas.toDataURL("image/jpeg");
        callback(dataURL);
    };
}

export default function PreviewModal({
    open,
    setOpen,
    form,
    setShowDialog,
}: Props) {
    const [file, setFile] = React.useState<File>();
    const [noti, setNoti] = React.useState<boolean>(false);
    const [notiMessage, setNotiMessage] = React.useState<string>("");
    const [notiStatus, setNotiStatus] = React.useState<string>("");
    const [tag, setTag] = React.useState<string>("");
    const [tagDel, setTagDel] = React.useState<string[]>([]);
    const tagInput = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const image = React.useRef() as React.MutableRefObject<HTMLImageElement>;

    const handlePublishArticle = async () => {
        const { title, description, image, tags } = form.values;
        if (
            title === "" ||
            description === "" ||
            !description ||
            !image ||
            image === "" ||
            (tags && tags.length === 0) ||
            !tags
        ) {
            setNoti(true);
            setNotiMessage("Oops there are some fields missing!");
            setNotiStatus("fail");
            return false;
        }
        const values = { ...form.values, tagDel: tagDel };
        values.published = true;
        await axios
            .put("http://localhost:5000/api/articles", values, {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    setNoti(true);
                    setNotiMessage("Published successfully!");
                    setNotiStatus("success");
                }
            })
            .catch((error) => {
                console.log(error);
                setNoti(true);
                setNotiMessage("Fail to published!");
                setNotiStatus("fail");
            });
    };

    const handleAddTags = () => {
        const tags = form.values.tags ? form.values.tags : [];
        if (tag.length < 1) {
            return false;
        }
        if (tags.length === 5) {
            setNoti(true);
            setNotiMessage("Oops that's more than 5 tags !");
            setNotiStatus("fail");
            return false;
        }
        let lowerTag = tag.toLowerCase();
        setTag(lowerTag);
        tags.push(lowerTag);
        form.setFieldValue("tags", tags);
        setTag("");
        tagInput.current.value = "";
        console.log(tags);
    };

    const handleDeleteTag = (tag: string) => {
        let tags = form.values.tags ? form.values.tags : [];
        let tagDels = tagDel;
        tagDels.push(tag);
        tags = tags.filter((tg) => tg !== tag);
        form.setFieldValue("tags", tags);
        setTagDel(tagDels);
    };

    React.useEffect(() => {
        if (image.current !== undefined && image.current) {
            toDataURL(image, function (dataUrl) {
                form.setFieldValue("image", dataUrl);
            });
        }
    }, [file]);

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            title={<Title order={3}>Preview</Title>}
            size="auto"
        >
            <Notifications
                noti={noti}
                setNoti={setNoti}
                notiStatus={notiStatus}
                notiMessage={notiMessage}
            />
            <Grid>
                <Grid.Col xl={6} lg={6} md={6} sm={6} xs={12}>
                    <Textarea
                        autosize={true}
                        label={
                            <Title order={6} color="gray">
                                Title of Your Post
                            </Title>
                        }
                        {...form.getInputProps("title")}
                        className="preview-title-input"
                        styles={{
                            input: {
                                borderTop: "none",
                                borderLeft: "none",
                                borderRight: "none",
                            },
                        }}
                    />
                    <Divider my="xs" />
                    <Textarea
                        autosize={true}
                        label={
                            <Title order={6}>
                                Add some description to your post
                            </Title>
                        }
                        {...form.getInputProps("description")}
                        placeholder="Description"
                        styles={{
                            input: {
                                borderTop: "none",
                                borderLeft: "none",
                                borderRight: "none",
                            },
                        }}
                    />
                    <Divider my="xs" />
                    <Title order={6}>Tags of your post (max 5)</Title>
                    <Space h="xs" />
                    <TextInput
                        onChange={(e) => setTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTags()}
                        ref={tagInput}
                        placeholder="Or enter a tag"
                    />
                    <Space h="xs" />
                    <Group spacing={5}>
                        {form.values.tags?.map((tag) => (
                            <Badge
                                sx={{ paddingRight: 3 }}
                                rightSection={
                                    <ActionIcon
                                        onClick={() => handleDeleteTag(tag)}
                                        variant="transparent"
                                    >
                                        <X size={16} />
                                    </ActionIcon>
                                }
                            >
                                <Text transform="capitalize" size="sm">
                                    {tag}
                                </Text>
                            </Badge>
                        ))}
                    </Group>
                </Grid.Col>
                <Grid.Col xl={6} lg={6} md={6} sm={6} xs={12}>
                    <Title order={6}>
                        Add an image to make your post more interesting
                    </Title>
                    <Space h="xs" />
                    {!file && !form.values.image ? (
                        <ImgDropzone setFile={setFile} />
                    ) : (
                        <Image
                            src={
                                form.values.image
                                    ? form.values.image
                                    : file
                                    ? URL.createObjectURL(file)
                                    : undefined
                            }
                            height={300}
                            width={350}
                            imageRef={image}
                        />
                    )}
                    <Group position="right" m={10}>
                        <Button
                            onClick={() => {
                                form.setFieldValue("image", null);
                                setFile(undefined);
                            }}
                        >
                            Discard
                        </Button>
                        <Button
                            onClick={() => {
                                handlePublishArticle();
                                setShowDialog(false);
                            }}
                        >
                            Publish
                        </Button>
                    </Group>
                </Grid.Col>
            </Grid>
        </Modal>
    );
}
