import {
    assertEquals,
    assertGreaterOrEqual,
    assertLessOrEqual
} from "../../_deps/dev.ts";
import htmlTitle from "./htmlTitle.ts";

Deno.test("It's prepended with my name", () => {
    const testTitle = "Gabriel's Critical Assessment";
    assertEquals(htmlTitle(testTitle), `Andy Preston - ${testTitle}`);
});

Deno.test("It truncates a long one to 70 characters", () => {
    const testTitle =
        "I'm afraid I find myself concurring with Gabriel's Critical Assessment";
    assertGreaterOrEqual(`Andy Preston - ${testTitle}`.length, 70);
    assertLessOrEqual(htmlTitle(testTitle).length, 70);

});
