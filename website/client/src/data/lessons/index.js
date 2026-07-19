// The three lessons, in teaching order.
//
// Each lesson lives in its own file so a change to one never touches another.
// Only one topic is taught in any session, and they are deliberately written to
// stand alone: no lesson refers to another.

import { prepare } from "../../lib/sample.js";
import { sqlTables } from "./sql-tables.js";
import { postEndpoint } from "./post-endpoint.js";
import { reactGet } from "./react-get.js";

// A sample written in `parts` is expanded here, once, so everything downstream
// sees the same plain `code` string it always did. See lib/sample.js.
const expand = (lesson) => ({
    ...lesson,
    code: (lesson.code || []).map(prepare),
    sections: lesson.sections.map((section) =>
        section.code ? { ...section, code: section.code.map(prepare) } : section
    ),
});

export const lessons = [sqlTables, postEndpoint, reactGet].map(expand);

export const findLesson = (slug) => lessons.find((lesson) => lesson.slug === slug);
