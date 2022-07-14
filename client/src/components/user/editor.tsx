import React from "react";
import Headers from "../general/layout/header";
import AppShell from "../general/layout/appShell";
import {
    Container,
    useMantineTheme,
    Grid,
    Title,
    Space,
    Card,
    Group,
    Tabs,
    Skeleton,
} from "@mantine/core";
import {
    useDocumentTitle,
    useShallowEffect,
    useViewportSize,
} from "@mantine/hooks";
import ArticleCard from "../general/article/articleCard";
import { Plus } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import IncompleteArticleCard from "../general/article/incompleteArticleCard";
import {
    handleCreateArticle,
    getUserArticles,
} from "../general/others/fetchDataFunctions";
import InfiniteScroll from "react-infinite-scroll-component";

export type Article = {
    own: boolean;
    _id: string;
    author: {
        _id: string;
        username: string;
        firstname: string;
        lastname: string;
        avatar: string;
    };
    content: string;
    description: string;
    favoritesCount: number;
    favorited: boolean;
    bookmarked: boolean;
    image: string;
    lastUpdated: string;
    published: boolean;
    slug: string;
    tags: string[] | null;
    title: string;
};

export default function Editor() {
    const theme = useMantineTheme();
    const [articleId, setArticleId] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(true);
    const [unpublishedArticles, setUnpublishedArticles] = React.useState<
        Article[]
    >([]);
    const [publishedArticles, setPublishedArticles] = React.useState<Article[]>(
        []
    );
    const [pageOffset, setPageOffset] = React.useState<number>(0);
    const [hasMore, setHasMore] = React.useState<boolean>(true);
    const { width } = useViewportSize();
    const navigate = useNavigate();
    const username = JSON.parse(localStorage.getItem("user") || "{}").username;
    useDocumentTitle("Editor - BBlog");

    React.useEffect(() => {
        if (articleId !== "") {
            navigate(`/write/${articleId}`);
        }
    }, [articleId]);

    useShallowEffect(() => {
        getUserArticles(
            "unpublished",
            "",
            setUnpublishedArticles,
            setLoading,
            pageOffset,
            setHasMore
        );
        getUserArticles(
            "published",
            username,
            setPublishedArticles,
            setLoading,
            pageOffset,
            setHasMore
        );
    }, [pageOffset]);

    return (
        <AppShell
            theme={theme}
            header={<Headers theme={theme} signin={false} />}
            footer={undefined}
            navbar={undefined}
            aside={undefined}
        >
            <Container p={width < 768 ? 0 : ""}>
                <Grid>
                    <Grid.Col>
                        <Title order={2}>Welcome to Writing Section</Title>
                    </Grid.Col>
                    <Grid.Col>
                        <Container>
                            <Card
                                onClick={() =>
                                    handleCreateArticle(setArticleId)
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <Group>
                                    <Plus />
                                    <Title order={3}>New Post</Title>
                                </Group>
                            </Card>
                        </Container>
                        <Space h="md" />
                        <Tabs>
                            <Tabs.Tab label="Continue writing">
                                <Container>
                                    <Space h="md" />
                                    <Grid>
                                        {unpublishedArticles.length > 0 ? (
                                            unpublishedArticles.map(
                                                (article) => (
                                                    <Grid.Col>
                                                        <Skeleton
                                                            visible={loading}
                                                            width="auto"
                                                        >
                                                            <IncompleteArticleCard
                                                                key={
                                                                    article._id
                                                                }
                                                                id={article._id}
                                                                title={
                                                                    article.title
                                                                }
                                                                content={
                                                                    article.content
                                                                }
                                                                lastUpdated={
                                                                    article.lastUpdated
                                                                }
                                                                setArticleId={
                                                                    setArticleId
                                                                }
                                                                setUnpublishedArticles={
                                                                    setUnpublishedArticles
                                                                }
                                                            />
                                                        </Skeleton>
                                                    </Grid.Col>
                                                )
                                            )
                                        ) : (
                                            <Title order={3}>
                                                Let's start with a new post
                                            </Title>
                                        )}
                                    </Grid>
                                </Container>
                            </Tabs.Tab>
                            <Tabs.Tab label="Published posts">
                                <Container p={width < 768 ? 0 : ""}>
                                    <Grid>
                                        <InfiniteScroll
                                            dataLength={
                                                publishedArticles.length
                                            }
                                            onScroll={(e) => e.preventDefault()}
                                            next={() =>
                                                setPageOffset((c) => c + 1)
                                            }
                                            hasMore={hasMore}
                                            loader={<h4>Loading...</h4>}
                                        >
                                            {publishedArticles.map(
                                                (article) => (
                                                    <Grid.Col key={article._id}>
                                                        <Skeleton
                                                            visible={loading}
                                                            width="auto"
                                                        >
                                                            <ArticleCard
                                                                key={
                                                                    article._id
                                                                }
                                                                article={{
                                                                    ...article,
                                                                    editable:
                                                                        true,
                                                                    own: true,
                                                                }}
                                                                setArticleId={
                                                                    setArticleId
                                                                }
                                                                setArticles={
                                                                    setPublishedArticles
                                                                }
                                                            />
                                                        </Skeleton>
                                                    </Grid.Col>
                                                )
                                            )}
                                        </InfiniteScroll>
                                    </Grid>
                                </Container>
                            </Tabs.Tab>
                        </Tabs>
                    </Grid.Col>
                </Grid>
            </Container>
        </AppShell>
    );
}
