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
    Skeleton,
} from "@mantine/core";
import { useDocumentTitle, useViewportSize } from "@mantine/hooks";
import AffixBtn from "../general/others/affix";
import { useWindowScroll, useShallowEffect } from "@mantine/hooks";
import Tag from "../general/others/tag";
import axios from "axios";
import { Article } from "../user/editor";
import { smallArticle } from "../general/article/smallArticleCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { MoodSad, News } from "tabler-icons-react";
import { baseUrl } from "../general/others/fetchDataFunctions";
import ArticleSkeleton from "../general/skeletons/articlesSkeleton";
import SmallArticleSkeleton from "../general/skeletons/smallArticleSkeleton";

export default function Home() {
    const theme = useMantineTheme();
    const { width } = useViewportSize();
    const [scroll, scrollTo] = useWindowScroll();
    const [articles, setArticles] = React.useState<Article[]>([]);
    const [trendingArticles, setTrendingArticles] = React.useState<
        smallArticle[]
    >([]);
    const [pageOffset, setPageOffset] = React.useState<number>(0);
    const [hasMore, setHasMore] = React.useState<boolean>(true);
    const [popularTags, setPopularTags] = React.useState<string[]>([]);
    const [tagLoading, setTagLoading] = React.useState<boolean>(true);
    const [trendingLoading, setTrendingLoading] = React.useState<boolean>(true);
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    useDocumentTitle("Home - BBlog");

    const getGlobalFeeds = async () => {
        console.log(pageOffset);
        await axios
            .get(`${baseUrl}/articles/global/${pageOffset}`, {
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
            .get(baseUrl + "/tags")
            .then((response) => {
                setPopularTags(response.data);
                setTagLoading(false);
            })
            .catch((error) => {
                setTagLoading(false);
                console.log(error);
            });
    };

    const getTrendingArticles = async () => {
        await axios
            .get(baseUrl + "/articles/trending")
            .then((response) => {
                setTrendingArticles(response.data);
                setTrendingLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setTrendingLoading(false);
            });
    };

    React.useEffect(() => {
        getTrendingArticles();
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
                    {width <= 1000 ? (
                        <Grid.Col xl={4} lg={4} md={4} sm={12} xs={12} key={2}>
                            <Title order={4}>Trending</Title>
                            <Space h="md" />
                            <Grid>
                                {!trendingLoading
                                    ? trendingArticles.map((article) => (
                                          <Grid.Col key={article._id} sm={6}>
                                              <SmallArticleCard
                                                  author={{
                                                      ...article.author,
                                                      description: "",
                                                      followed: false,
                                                  }}
                                                  _id={article._id}
                                                  title={article.title}
                                                  slug={article.slug}
                                                  lastUpdated={
                                                      article.lastUpdated
                                                  }
                                              />
                                          </Grid.Col>
                                      ))
                                    : [1, 2, 3, 4].map((x) => (
                                          <Grid.Col key={x} sm={6}>
                                              <SmallArticleSkeleton />
                                          </Grid.Col>
                                      ))}
                            </Grid>
                            <Divider my="lg" />
                            <Title order={4}>Popular topics</Title>
                            <Space h="md" />
                            <Group direction="row">
                                {!tagLoading
                                    ? popularTags.map((tag) => (
                                          <Tag tag={tag} />
                                      ))
                                    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                          (x) => (
                                              <Skeleton width="auto"></Skeleton>
                                          )
                                      )}
                            </Group>
                            <Space h="md" />
                        </Grid.Col>
                    ) : null}

                    <MediaQuery smallerThan="xs" styles={{ padding: 0 }}>
                        <Grid.Col xl={8} lg={8} md={8} sm={12} xs={12} key={0}>
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
                                            loader={[1, 2, 3].map((x) => (
                                                <Grid.Col key={x}>
                                                    <ArticleSkeleton />
                                                </Grid.Col>
                                            ))}
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
                                                        article={{
                                                            ...article,
                                                            editable: false,
                                                        }}
                                                        setArticleId={() => ""}
                                                        setArticles={
                                                            setArticles
                                                        }
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
                    {width > 1000 ? (
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
                                    {!tagLoading
                                        ? popularTags.map((tag) => (
                                              <Tag tag={tag} key={tag} />
                                          ))
                                        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                              (x) => (
                                                  <Skeleton
                                                      width="auto"
                                                      key={x}
                                                  >
                                                      Lorem, ipsum.
                                                  </Skeleton>
                                              )
                                          )}
                                </Group>
                                <Divider my="lg" />
                                <Title order={4}>Trending</Title>
                                <Space h="md" />
                                <ScrollArea style={{ height: "55vh" }}>
                                    <Container>
                                        <Grid>
                                            {!trendingLoading
                                                ? trendingArticles.map(
                                                      (article) => (
                                                          <Grid.Col
                                                              key={article._id}
                                                          >
                                                              <SmallArticleCard
                                                                  author={{
                                                                      ...article.author,
                                                                      description:
                                                                          "",
                                                                      followed:
                                                                          false,
                                                                  }}
                                                                  _id={
                                                                      article._id
                                                                  }
                                                                  title={
                                                                      article.title
                                                                  }
                                                                  slug={
                                                                      article.slug
                                                                  }
                                                                  lastUpdated={
                                                                      article.lastUpdated
                                                                  }
                                                              />
                                                          </Grid.Col>
                                                      )
                                                  )
                                                : [1, 2, 3, 4].map((x) => (
                                                      <Grid.Col key={x}>
                                                          <SmallArticleSkeleton />
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
    const theme = useMantineTheme();

    const getFollowingArticles = async () => {
        axios
            .get(`${baseUrl}/articles/following/${pageOffset}`, {
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
                loader={[1, 2, 3].map((x) => (
                    <Grid.Col key={x}>
                        <ArticleSkeleton />
                    </Grid.Col>
                ))}
            >
                {followingArticles.map((article) => (
                    <Grid.Col key={article._id}>
                        <ArticleCard
                            key={article._id}
                            article={{
                                ...article,
                                editable: false,
                            }}
                            setArticleId={() => ""}
                            setArticles={setFollowingArticles}
                        />
                    </Grid.Col>
                ))}
            </InfiniteScroll>
            {followingArticles.length === 0 && (
                <>
                    {" "}
                    <Grid.Col>
                        <Center>
                            <News
                                size={60}
                                strokeWidth={2}
                                color={
                                    theme.colorScheme === "dark"
                                        ? "white"
                                        : "black"
                                }
                            />
                        </Center>
                    </Grid.Col>
                    <Grid.Col>
                        <Title order={3} align="center">
                            Let's start by following some authors
                        </Title>
                    </Grid.Col>
                </>
            )}
        </Grid>
    );
}
