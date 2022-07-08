import React from "react";
import Headers from "../general/layout/header";
import AppShell from "../general/layout/appShell";
import ArticleCard from "../general/article/articleCard";
import SmallArticleCard from "../general/article/smallArticleCard";
import {
    Container,
    Grid,
    Space,
    useMantineTheme,
    Title,
    ScrollArea,
    Group,
    Divider,
    MediaQuery,
    Tabs,
    Center,
} from "@mantine/core";
import { useDocumentTitle, useViewportSize } from "@mantine/hooks";
import AffixBtn from "../general/others/affix";
import { useWindowScroll, useShallowEffect } from "@mantine/hooks";
import Tag from "../general/others/tag";
import axios from "axios";
import { Article } from "../user/editor";
import InfiniteScroll from "react-infinite-scroll-component";
import { MoodSad } from "tabler-icons-react";

export default function Home() {
    const theme = useMantineTheme();
    const { width } = useViewportSize();
    const [scroll, scrollTo] = useWindowScroll();
    const [articles, setArticles] = React.useState<Article[]>([]);
    const [pageOffset, setPageOffset] = React.useState<number>(0);
    const [hasMore, setHasMore] = React.useState<boolean>(true);
    const [popularTags, setPopularTags] = React.useState<string[]>([]);
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    useDocumentTitle("Home - BBlog");

    const getGlobalFeeds = async () => {
        console.log(pageOffset);
        await axios
            .get(`http://localhost:5000/api/articles/global/${pageOffset}`, {
                headers: {
                    "x-access-token": token,
                },
            })
            .then((response) => {
                setArticles((articles) => articles.concat(response.data));
                if (response.data.length < 3) {
                    setHasMore(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getPopularTags = async () => {
        await axios
            .get("http://localhost:5000/api/tags")
            .then((response) => {
                setPopularTags(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    React.useEffect(() => {
        getPopularTags();
    }, []);

    useShallowEffect(() => {
        getGlobalFeeds();
    }, [pageOffset]);

    return (
        <AppShell
            theme={theme}
            header={<Headers theme={theme} signin={false} />}
            navbar={undefined}
            aside={undefined}
            footer={undefined}
        >
            <Container size="xl">
                <Grid>
                    {width <= 768 ? (
                        <Grid.Col xl={4} lg={4} md={4} sm={4} xs={12} key={2}>
                            <Title order={4}>Trending</Title>
                            <Space h="md" />
                            <Grid>
                                {articles.map((article) => (
                                    <Grid.Col>
                                        <SmallArticleCard
                                            author={{
                                                ...article.author,
                                                description: "lorem",
                                                followed: false,
                                            }}
                                            article={{
                                                _id: article._id,
                                                title: article.title,
                                                tag: "lorem",
                                                slug: article.slug,
                                                lastUpdated:
                                                    article.lastUpdated,
                                            }}
                                            own={article.own}
                                        />
                                    </Grid.Col>
                                ))}
                            </Grid>
                            <Divider my="lg" />
                            <Title order={4}>Popular topics</Title>
                            <Space h="md" />
                            <Group direction="row">
                                {popularTags.map((tag) => (
                                    <Tag tag={tag} />
                                ))}
                            </Group>
                            <Space h="md" />
                        </Grid.Col>
                    ) : null}

                    <MediaQuery smallerThan="xs" styles={{ padding: 0 }}>
                        <Grid.Col xl={8} lg={8} md={8} sm={8} xs={12} key={0}>
                            <Tabs>
                                <Tabs.Tab label="Global feeds" key={5}>
                                    <Grid>
                                        <InfiniteScroll
                                            dataLength={articles.length}
                                            next={() =>
                                                setPageOffset((c) => c + 1)
                                            }
                                            onScroll={(e) => e.preventDefault()}
                                            hasMore={hasMore}
                                            loader={<h4>Loading...</h4>}
                                            endMessage={
                                                <>
                                                    <Center>
                                                        <MoodSad
                                                            size={48}
                                                            strokeWidth={2}
                                                            color={
                                                                theme.colorScheme ===
                                                                "dark"
                                                                    ? "white"
                                                                    : "black"
                                                            }
                                                        />
                                                    </Center>
                                                    <Title
                                                        order={5}
                                                        align="center"
                                                    >
                                                        Oops there's no more for
                                                        now
                                                    </Title>
                                                </>
                                            }
                                        >
                                            {articles.map((article) => (
                                                <Grid.Col key={article._id}>
                                                    <ArticleCard
                                                        key={article._id}
                                                        _id={article._id}
                                                        title={article.title}
                                                        image={article.image}
                                                        author={article.author}
                                                        description={
                                                            article.description
                                                        }
                                                        lastUpdated={
                                                            article.lastUpdated
                                                        }
                                                        slug={article.slug}
                                                        tags={article.tags}
                                                        favoritesCount={
                                                            article.favoritesCount
                                                        }
                                                        favorited={
                                                            article.favorited
                                                        }
                                                        bookmarked={
                                                            article.bookmarked
                                                        }
                                                        own={article.own}
                                                        setArticleId={() => ""}
                                                        setArticles={
                                                            setArticles
                                                        }
                                                        editable={false}
                                                    />
                                                </Grid.Col>
                                            ))}
                                        </InfiniteScroll>
                                    </Grid>
                                </Tabs.Tab>
                                {token && (
                                    <Tabs.Tab label="Following" key={6}>
                                        <FollowingFeeds />
                                    </Tabs.Tab>
                                )}
                            </Tabs>
                        </Grid.Col>
                    </MediaQuery>
                    {width > 768 ? (
                        <Grid.Col xl={4} lg={4} md={4} sm={4} xs={12} key={1}>
                            <Container
                                style={{
                                    position: "sticky",
                                    top: 80,
                                }}
                            >
                                <Title order={4}>Popular Topics</Title>
                                <Space h="md" />
                                <Group direction="row">
                                    {popularTags.map((tag) => (
                                        <Tag tag={tag} key={tag} />
                                    ))}
                                </Group>
                                <Divider my="lg" />
                                <Title order={4}>Trending</Title>
                                <Space h="md" />
                                <ScrollArea style={{ height: "55vh" }}>
                                    <Container>
                                        <Grid>
                                            {articles.map((article) => (
                                                <Grid.Col>
                                                    <SmallArticleCard
                                                        author={{
                                                            ...article.author,
                                                            description:
                                                                "lorem",
                                                            followed: false,
                                                        }}
                                                        article={{
                                                            _id: article._id,
                                                            title: article.title,
                                                            tag: "lorem",
                                                            slug: article.slug,
                                                            lastUpdated:
                                                                article.lastUpdated,
                                                        }}
                                                        own={article.own}
                                                    />
                                                </Grid.Col>
                                            ))}
                                        </Grid>
                                    </Container>
                                </ScrollArea>
                            </Container>
                        </Grid.Col>
                    ) : null}
                    <AffixBtn
                        name="Scroll to top"
                        func={() => scrollTo({ y: 0 })}
                        mounted={scroll.y > 0}
                        bottom={20}
                        right={20}
                    />
                </Grid>
            </Container>
        </AppShell>
    );
}

function FollowingFeeds() {
    const [followingArticles, setFollowingArticles] = React.useState<Article[]>(
        []
    );
    const [pageOffset, setPageOffset] = React.useState<number>(0);
    const [hasMore, setHasMore] = React.useState<boolean>(true);
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;

    const getFollowingArticles = async () => {
        axios
            .get(`http://localhost:5000/api/articles/following/${pageOffset}`, {
                headers: {
                    "x-access-token": token,
                },
            })
            .then((response) => {
                let tempArticles = followingArticles;
                tempArticles = tempArticles.concat(response.data);
                setFollowingArticles(tempArticles);
                setPageOffset((c) => c + 1);
                if (response.data.length < 3) {
                    setHasMore(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    React.useEffect(() => {
        getFollowingArticles();
    }, []);

    return (
        <Grid>
            <InfiniteScroll
                dataLength={followingArticles.length}
                next={getFollowingArticles}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
            >
                {followingArticles.map((article) => (
                    <Grid.Col key={article._id}>
                        <ArticleCard
                            key={article._id}
                            _id={article._id}
                            title={article.title}
                            image={article.image}
                            author={article.author}
                            description={article.description}
                            lastUpdated={article.lastUpdated}
                            slug={article.slug}
                            tags={article.tags}
                            favoritesCount={article.favoritesCount}
                            favorited={article.favorited}
                            bookmarked={article.bookmarked}
                            own={article.own}
                            setArticleId={() => ""}
                            setArticles={setFollowingArticles}
                            editable={false}
                        />
                    </Grid.Col>
                ))}
            </InfiniteScroll>
        </Grid>
    );
}
