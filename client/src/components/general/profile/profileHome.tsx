import { Container, MediaQuery, Grid, Center, Skeleton } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import ArticleCard from "../article/articleCard";
import React, { Dispatch, SetStateAction } from "react";
import { getUserArticles } from "../others/fetchDataFunctions";
import { Article } from "../../user/editor";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
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
    const author = other
        ? username
        : JSON.parse(localStorage.getItem("user") || "{}").username;

    const getBookmarkArticle = async () => {
        await axios
            .get(
                `http://localhost:5000/api/article/bm/${username}/${pageOffset}`
            )
            .then((res) => {
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
        <Container>
            <MediaQuery smallerThan="xs" styles={{ padding: 0 }}>
                <Center>
                    <MediaQuery smallerThan="xs" styles={{ padding: 0 }}>
                        <Grid>
                            <InfiniteScroll
                                dataLength={articles.length}
                                onScroll={(e) => e.preventDefault()}
                                next={() => setPageOffset((c) => c + 1)}
                                hasMore={hasMore}
                                loader={<h4>Loading...</h4>}
                            >
                                {articles.map((article) => (
                                    <Grid.Col key={article._id}>
                                        <Skeleton
                                            visible={loading}
                                            width="auto"
                                        >
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
                                                favorited={article.favorited}
                                                bookmarked={article.bookmarked}
                                                own={tab === "home" && !other}
                                                setArticleId={() => ""}
                                                setArticles={setArticles}
                                                editable={false}
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
