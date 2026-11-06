import WpDocument from "@/components/wp/WpDocument";
import PageNotFound from "@/generated/wp/pages/not-found";
import "./(wp)/[[...slug]]/clone.css";

// WordPress 404 template ("Page Not Found | Todo IP"), served with HTTP 404 for
// every URL the live site does not have.
export default function GlobalNotFound() {
  return (
    <WpDocument path="__404">
      <PageNotFound path="__404" />
    </WpDocument>
  );
}
