import React from "react";
import Headers from "../general/layout/header";
import AppShell from "../general/layout/appShell";
import {
    Container,
    useMantineTheme,
    Grid,
    Title,
    Space,
    Textarea,
    Transition,
    Button,
    Group,
    Skeleton,
    TypographyStylesProvider,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/rte";
import { useDocumentTitle, useForm, useViewportSize } from "@mantine/hooks";
import PreviewModal from "../general/editor/previewModal";
import AffixBtn from "../general/others/affix";
import "../../css/editor.css";
import { useParams } from "react-router-dom";
import Notifications from "../general/others/notification";
import { useCallbackPrompt } from "../general/others/useCallbackPrompt";
import {
    getEditArticle,
    handleUpdateArticle,
} from "../general/others/fetchDataFunctions";
import NavDialog from "../general/others/dialog";

export interface Article {
    _id: string;
    author: string;
    content: string;
    description: string | null;
    favoritesCount: number;
    image: string | null;
    lastUpdated: string;
    published: boolean;
    slug: string | null;
    tags: string[] | null;
    title: string | null;
}

export default function NewPost() {
    const theme = useMantineTheme();
    const { width } = useViewportSize();
    const [openPreview, setOpenPreview] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [noti, setNoti] = React.useState<boolean>(false);
    const [notiMessage, setNotiMessage] = React.useState<string>("");
    const [notiStatus, setNotiStatus] = React.useState<string>("");
    const [showDialog, setShowDialog] = React.useState<boolean>(false);
    const [showPrompt, confirmNavigation, cancelNavigation] =
        useCallbackPrompt(showDialog);
    const { article_id } = useParams();

    const form = useForm<Article>({
        initialValues: {
            _id: "",
            title: "",
            content: "",
            author: "",
            description: "",
            favoritesCount: 0,
            image: null,
            lastUpdated: "",
            slug: null,
            tags: null,
            published: false,
        },
    });

    const handleImageUpload = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            console.log(file);

            const formData = new FormData();
            formData.append("image", file);

            fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGSV_API_KEY}`,
                {
                    method: "POST",
                    body: formData,
                }
            )
                .then((response) => response.json())
                .then((result) => {
                    resolve(result.data.url);
                })
                .catch(() => reject(new Error("Upload failed")));
        });

    useDocumentTitle(
        form.values.title
            ? form.values.title.length > 0
                ? form.values.title + " - BBlog"
                : "New post - BBlog"
            : "New post - BBlog"
    );

    React.useEffect(() => {
        getEditArticle(article_id ? article_id : "", form, setLoading);
    }, []);

    return (
        <AppShell
            theme={theme}
            header={<Headers theme={theme} signin={false} />}
            footer={undefined}
            navbar={undefined}
            aside={undefined}
        >
            <NavDialog
                // @ts-ignore
                showDialog={showPrompt}
                cancelNavigation={cancelNavigation}
                confirmNavigation={confirmNavigation}
            />
            <Notifications
                noti={noti}
                setNoti={setNoti}
                notiStatus={notiStatus}
                notiMessage={notiMessage}
            />
            <Container size="xl">
                <Grid>
                    <Grid.Col>
                        <Title order={4}>
                            What title do you want for your post?
                        </Title>
                        <Space h="md" />
                        <Skeleton visible={loading} width="auto">
                            <Textarea
                                placeholder="Your title's here"
                                size="lg"
                                autosize
                                value={
                                    form.values.title ? form.values.title : ""
                                }
                                onChange={(event) => {
                                    form.setFieldValue(
                                        "title",
                                        event.target.value
                                    );
                                    setShowDialog(true);
                                }}
                                className="preview-title-input"
                            />
                        </Skeleton>
                    </Grid.Col>
                    <Grid.Col>
                        <PreviewModal
                            open={openPreview}
                            setOpen={setOpenPreview}
                            form={form}
                            setShowDialog={setShowDialog}
                        />
                        <Title order={4}>The body of your post</Title>
                        <Space h="md" />
                        {form.values.content !== "" ? (
                            <TypographyStylesProvider className="article-content">
                                <RichTextEditor
                                    value={form.values.content}
                                    onChange={(value) => {
                                        form.setFieldValue("content", value);
                                        setShowDialog(true);
                                    }}
                                    sticky
                                    stickyOffset={50}
                                    onImageUpload={(file) =>
                                        handleImageUpload(file)
                                    }
                                />
                            </TypographyStylesProvider>
                        ) : (
                            <Skeleton
                                visible={loading}
                                width="100%"
                                height="200%"
                            />
                        )}
                    </Grid.Col>
                    {width > 768 ? (
                        <Grid.Col>
                            {form.values._id !== "" && (
                                <AffixBtn
                                    name="Save"
                                    func={() => {
                                        handleUpdateArticle(
                                            form,
                                            openPreview,
                                            setNoti,
                                            setNotiMessage,
                                            setNotiStatus
                                        );
                                        setShowDialog(false);
                                    }}
                                    mounted={
                                        openPreview
                                            ? false
                                            : form.values.title
                                            ? form.values.title!.length > 0
                                            : form.values.content !==
                                              "<p>Your story starts here</p>"
                                    }
                                    bottom={20}
                                    right={100}
                                />
                            )}
                            <AffixBtn
                                name="Finish"
                                func={() => {
                                    setOpenPreview(true);
                                }}
                                mounted={
                                    openPreview
                                        ? false
                                        : form.values.title
                                        ? form.values.title!.length > 0
                                        : form.values.content !==
                                          "<p>Your story starts here</p>"
                                }
                                bottom={20}
                                right={20}
                            />
                        </Grid.Col>
                    ) : (
                        <Grid.Col>
                            <Transition
                                transition="slide-up"
                                mounted={
                                    openPreview
                                        ? false
                                        : form.values.title
                                        ? form.values.title!.length > 0
                                        : form.values.content !==
                                          "<p>Your story starts here</p>"
                                }
                            >
                                {(transitionStyles) => (
                                    <Group spacing={5} position="right">
                                        {form.values._id !== "" && (
                                            <Button
                                                style={transitionStyles}
                                                onClick={() => {
                                                    handleUpdateArticle(
                                                        form,
                                                        openPreview,
                                                        setNoti,
                                                        setNotiMessage,
                                                        setNotiStatus
                                                    );
                                                    setShowDialog(false);
                                                }}
                                            >
                                                Save
                                            </Button>
                                        )}
                                        <Button
                                            style={transitionStyles}
                                            onClick={() => {
                                                setOpenPreview(true);
                                            }}
                                        >
                                            Finish
                                        </Button>
                                    </Group>
                                )}
                            </Transition>
                        </Grid.Col>
                    )}
                </Grid>
            </Container>
        </AppShell>
    );
}
