import React from "react";
import Headers from "../general/layout/header";
import AppShell from "../general/layout/appShell";
import {
    Grid,
    useMantineTheme,
    Container,
    Title,
    Space,
    Center,
} from "@mantine/core";
import ContentSection from "../general/article/contentSection";
import CommentSection from "../general/article/commentSection";
import ArticleSideBar from "../general/article/articleSideBar";
import Sidebar from "../general/layout/sidebar";
import { useViewportSize, useDocumentTitle } from "@mantine/hooks";
import SmallArticleCard from "../general/article/smallArticleCard";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MoodSad } from "tabler-icons-react";

export interface Post {
    _id: string;
    author: {
        _id: string;
        username: string;
        firstname: string;
        lastname: string;
        avatar: string;
        description: string;
        followed: boolean;
    };
    description: string;
    favoritesCount: number;
    favorited: boolean;
    bookmarked: boolean;
    lastUpdated: string;
    slug: string;
    tags: string[] | null;
    title: string;
    content: string;
    own: boolean;
    otherArticles: {
        _id: string;
        title: string;
        tag: string;
        slug: string;
        lastUpdated: string;
    }[];
}

export default function Article() {
    const theme = useMantineTheme();
    const [article, setArticle] = React.useState<Post>({
        _id: "",
        author: {
            _id: "",
            username: "",
            firstname: "",
            lastname: "",
            avatar: "",
            description: "",
            followed: false,
        },
        description: "",
        favoritesCount: 0,
        favorited: false,
        bookmarked: false,
        lastUpdated: "",
        slug: "",
        tags: [],
        title: "",
        content: "",
        own: false,
        otherArticles: [],
    });
    const { width } = useViewportSize();
    const { id } = useParams();
    useDocumentTitle(article.title);
    const getArticle = async () => {
        await axios
            .get(`http://localhost:5000/api/article?articleId=${id}`, {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    setArticle(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    React.useEffect(() => {
        getArticle();
    }, [id]);

    return (
        <AppShell
            theme={theme}
            header={<Headers theme={theme} signin={false} />}
            aside={
                <Sidebar size={[0, 300, 400]}>
                    <ArticleSideBar
                        author={article.author}
                        otherArticles={article.otherArticles}
                        own={article.own}
                    />
                </Sidebar>
            }
            footer={undefined}
            navbar={undefined}
        >
            <Grid gutter={30}>
                <Grid.Col p={width < 768 ? 0 : null!} pt={0}>
                    <ContentSection article={article} />
                </Grid.Col>
                <Grid.Col>
                    <CommentSection />
                </Grid.Col>
                {width < 900 ? (
                    <Grid.Col>
                        <Title order={5}>More of Hien Nguyen</Title>
                        <Space h="md" />
                        <Container>
                            <Grid>
                                {article.otherArticles.length > 0 ? (
                                    article.otherArticles.map((post) => (
                                        <Grid.Col>
                                            <SmallArticleCard
                                                author={article.author}
                                                article={post}
                                                own={article.own}
                                            />
                                        </Grid.Col>
                                    ))
                                ) : (
                                    <Grid.Col>
                                        <Center>
                                            <MoodSad
                                                size={48}
                                                strokeWidth={2}
                                                color={
                                                    theme.colorScheme === "dark"
                                                        ? "white"
                                                        : "black"
                                                }
                                            />
                                        </Center>
                                        <Title order={5} align="center">
                                            No more from{" "}
                                            {article.author.lastname +
                                                " " +
                                                article.author.firstname}{" "}
                                            for now
                                        </Title>
                                    </Grid.Col>
                                )}
                            </Grid>
                        </Container>
                    </Grid.Col>
                ) : null}
            </Grid>
        </AppShell>
    );
}
