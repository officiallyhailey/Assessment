import { useParams } from "react-router-dom";
import { findLesson } from "../data/lessons";
import ScrollLesson from "./ScrollLesson";
import PagedLesson from "./PagedLesson";

// Two shapes of lesson. Most scroll, with the code pinned alongside and kept in
// step with the passage being read. A lesson marked `paged` shows one section at
// a time instead, chosen from the rail; topic 1 uses it because its SQL is three
// separate statements rather than one file to read down. See the two files.

function Lesson() {
    const { slug } = useParams();
    const lesson = findLesson(slug);
    if (!lesson) return null;
    return lesson.paged ? <PagedLesson lesson={lesson} /> : <ScrollLesson lesson={lesson} />;
}

export default Lesson;
