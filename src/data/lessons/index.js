// The three lessons, in teaching order.
//
// Each lesson lives in its own file so a change to one never touches another.
// Only one topic is taught in any session, and they are deliberately written to
// stand alone: no lesson refers to another.

import { sqlTables } from "./sql-tables.js";
import { postEndpoint } from "./post-endpoint.js";
import { reactGet } from "./react-get.js";

export const lessons = [sqlTables, postEndpoint, reactGet];

export const findLesson = (slug) => lessons.find((lesson) => lesson.slug === slug);
