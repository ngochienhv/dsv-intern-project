import {
    Avatar,
    Container,
    Group,
    Title,
    Card,
    Text,
    Space,
    Skeleton,
} from "@mantine/core";
import React from "react";

export default function SmallArticleSkeleton() {
    return (
        <Card shadow="xs">
            <Container>
                <Group direction="row">
                    <Skeleton circle height={50}>
                        <Avatar radius="xl" src={null} size="sm" />
                    </Skeleton>
                    <Skeleton width="auto">
                        <Title order={5}>Lorem, ipsum dolor.</Title>
                    </Skeleton>
                </Group>
                <Space h="xs" />
                <Skeleton width="auto">
                    <Text component={Title} order={6} lineClamp={1}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Id, accusantium!
                    </Text>
                </Skeleton>
                <Space h="xs" />
                <Group>
                    <Skeleton width="auto">
                        <Text>Lorem ipsum dolor sit.</Text>
                    </Skeleton>
                </Group>
            </Container>
        </Card>
    );
}
