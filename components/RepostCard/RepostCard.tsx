import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // or useNavigation for React Navigation
import { Id } from "@/convex/_generated/dataModel";
import { formatDate } from "@/lib/utils";


// Types for your repost and post (adjust as needed)
interface Repost {
    post: {
        author: {
            _id: Id<"users"> | undefined;
            username: string | undefined;
            profilePicture: string;
        };
        _id: Id<"posts">;
        _creationTime: number;
        reposts?: {
            repostorId: string;
            timestamp: number;
        }[] | undefined;
        postImage?: string | undefined;
        content: string;
        authorId: Id<"users">;
        category: string;
        likes: number;
    };
    repostContent: {
        content: string | undefined;
        repostImage: string | undefined;
        repostedAt: number | undefined;
        repostedBy: {
            _id: Id<"users"> | undefined;
            username: string | undefined;
            profilePicture: string;
        };
    };
}

type Props = {
  repost: Repost|null;
};

export default function RepostCard({ repost }: Props) {
  const router = useRouter();

  const handleOriginalPostPress = () => {
    router.push(`/post/${repost?.post._id}`);
  };

  return (
    <View style={styles.card}>
      {/* Reposter Info */}
      <View style={styles.header}>
        <Image
          source={{ uri: repost?.repostContent.repostedBy.profilePicture || "https://www.gravatar.com/avatar/?d=mp" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{repost?.repostContent.repostedBy.username} reposted</Text>
        <Text style={styles.time}>{formatDate(repost?.repostContent.repostedAt||0)}</Text>
      </View>

      {/* Repost Comment and Image */}
      {!!repost?.repostContent.content && <Text style={styles.comment}>{repost?.repostContent.content}</Text>}
      {!!repost?.repostContent.repostImage && (
        <Image source={{ uri: repost.repostContent.repostImage }} style={styles.repostImage} />
      )}

      {/* Quoted Original Post (clickable) */}
      <TouchableOpacity style={styles.quotedPost} onPress={handleOriginalPostPress} activeOpacity={0.9}>
        <View style={styles.originalHeader}>
          <Image
            source={{ uri: repost?.post.author.profilePicture || "https://www.gravatar.com/avatar/?d=mp" }}
            style={styles.originalAvatar}
          />
          <Text style={styles.originalUsername}>{repost?.post.author.username}</Text>
        </View>
        <Text style={styles.originalContent}>{repost?.post.content}</Text>
        {!!repost?.post.postImage && (
          <Image source={{ uri: repost?.post.postImage }} style={styles.originalImage} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#f6f8fa",
    padding: 12,
    marginVertical: 8,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 8,
    backgroundColor: "#ddd"
  },
  username: { fontWeight: "bold", fontSize: 15, marginRight: 6 },
  time: { color: "#888", fontSize: 12 },
  comment: { fontSize: 15, marginVertical: 4, color: "#222" },
  repostImage: { width: "100%", height: 180, borderRadius: 8, marginBottom: 8 },
  quotedPost: {
    backgroundColor: "#fff",
    borderRadius: 9,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2b2bff",
  },
  originalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  originalAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 6, backgroundColor: "#ddd" },
  originalUsername: { fontWeight: "bold", fontSize: 14, color: "#2b2bff" },
  originalContent: { fontSize: 14, color: "#222", marginVertical: 2 },
  originalImage: { width: "100%", height: 120, borderRadius: 6, marginTop: 6 },
});