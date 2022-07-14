import {
    Container,
    Divider,
    Grid,
    Title,
    useMantineTheme,
    Group,
    TextInput,
    Button,
} from "@mantine/core";
import { Article } from "./editor";
import ArticleCard from "../general/article/articleCard";
import Headers from "../general/layout/header";
import AppShell from "../general/layout/appShell";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import {
    useDocumentTitle,
    useShallowEffect,
    useInputState,
} from "@mantine/hooks";
import { Search } from "tabler-icons-react";
import { baseUrl } from "../general/others/fetchDataFunctions";

export default function SearchByTag() {
    const [articles, setArticles] = React.useState<Article[]>([]);
    const [stringValue, setStringValue] = useInputState<string>("");
    const { tag } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    let searchString = searchParams.get("q");
    const theme = useMantineTheme();

    const getTagsArticles = async () => {
        await axios
            .get(`${baseUrl}/tags/${tag}`, {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            })
            .then((response) => {
                console.log(response.data);

                setArticles(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const getSearchResults = async () => {
        await axios
            .get(`${baseUrl}/articles/search?searchString=${searchString}`, {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            })
            .then((response) => {
                console.log(response.data);
                setArticles(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useDocumentTitle(tag ? tag : searchString + " - BBlog");
    useShallowEffect(() => {
        if (tag) {
            getTagsArticles();
        } else {
            getSearchResults();
        }
    }, []);

    useShallowEffect(() => {
        if (tag) {
            getTagsArticles();
        } else {
            getSearchResults();
        }
    }, [tag, searchString]);

    return (
        <AppShell
            theme={theme}
            header={<Headers theme={theme} signin={false} />}
            navbar={undefined}
            aside={undefined}
            footer={undefined}
        >
            <Container>
                <Grid>
                    <Grid.Col>
                        <Group direction="column" grow>
                            <TextInput
                                placeholder="Search..."
                                rightSection={
                                    <Button
                                        variant="subtle"
                                        onClick={() =>
                                            navigate(
                                                `/search?q=${encodeURIComponent(
                                                    stringValue
                                                )}`
                                            )
                                        }
                                    >
                                        <Search />
                                    </Button>
                                }
                                rightSectionWidth={70}
                                radius={10}
                                type="search"
                                value={stringValue}
                                onChange={setStringValue}
                                onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    navigate(
                                        `/search?q=${encodeURIComponent(
                                            stringValue
                                        )}`
                                    )
                                }
                            />
                            {(searchString || tag) && (
                                <>
                                    <Title order={1}>
                                        <Group>
                                            <Search size={30} strokeWidth={3} />
                                            {tag
                                                ? tag.toUpperCase()
                                                : searchString}
                                        </Group>
                                    </Title>
                                    <Title order={4}>
                                        {articles.length + " "}{" "}
                                        {articles.length > 1
                                            ? "articles"
                                            : "article"}
                                    </Title>
                                </>
                            )}
                        </Group>
                        <Divider my="md" />
                    </Grid.Col>
                    {articles.map((article) => (
                        <Grid.Col key={article._id}>
                            <ArticleCard
                                article={{
                                    ...article,
                                    editable: false,
                                }}
                                setArticleId={() => ""}
                                setArticles={setArticles}
                            />
                        </Grid.Col>
                    ))}
                </Grid>
            </Container>
        </AppShell>
    );
}
