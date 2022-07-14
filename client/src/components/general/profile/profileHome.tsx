import { Container, MediaQuery, Grid, Center, Skeleton } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import ArticleCard from "../article/articleCard";
import React, { Dispatch, SetStateAction } from "react";
import { getUserArticles, baseUrl } from "../others/fetchDataFunctions";
import { Article } from "../../user/editor";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import ArticleSkeleton from "../skeletons/articlesSkeleton";
import axios from "axios";

export default function ProfileHome({
    tab,
    loading,
    setLoading,
    other,
}: {
    tab: string;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    other: boolean;
}) {
    const [articles, setArticles] = React.useState<Article[]>([]);
    const [pageOffset, setPageOffset] = React.useState<number>(0);
    const [hasMore, setHasMore] = React.useState<boolean>(true);
    const { username } = useParams();
    const author = username ? username : "";

    const getBookmarkArticle = async () => {
        await axios
            .get(`${baseUrl}/article/bm/${username}/${pageOffset}`, {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            })
            .then((res) => {
                console.log(res);

                let tempArticles = articles;
                tempArticles = tempArticles.concat(res.data);
                setArticles(tempArticles);
                if (res.data.length < 3) {
                    setHasMore(false);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    useShallowEffect(() => {
        if (tab === "home") {
            getUserArticles(
                "published",
                author,
                setArticles,
                setLoading,
                pageOffset,
                setHasMore
            );
        } else {
            getBookmarkArticle();
        }
    }, [pageOffset]);

    return (
        <Container size="lg">
            <MediaQuery smallerThan="xs" styles={{ padding: 0 }}>
                <Center>
                    <MediaQuery smallerThan="xs" styles={{ padding: 0 }}>
                        <Grid>
                            <InfiniteScroll
                                dataLength={articles.length}
                                onScroll={(e) => e.preventDefault()}
                                next={() => setPageOffset((c) => c + 1)}
                                hasMore={hasMore}
                                loader={[1, 2, 3].map((x) => (
                                    <Grid.Col key={x}>
                                        <ArticleSkeleton />
                                    </Grid.Col>
                                ))}
                            >
                                {articles.map((article) => (
                                    <Grid.Col key={article._id}>
                                        <Skeleton
                                            visible={loading}
                                            width="auto"
                                        >
                                            <ArticleCard
                                                key={article._id}
                                                article={{
                                                    ...article,
                                                    editable: false,
                                                }}
                                                setArticleId={() => ""}
                                                setArticles={setArticles}
                                            />
                                        </Skeleton>
                                    </Grid.Col>
                                ))}
                            </InfiniteScroll>
                        </Grid>
                    </MediaQuery>
                </Center>
            </MediaQuery>
        </Container>
    );
}
