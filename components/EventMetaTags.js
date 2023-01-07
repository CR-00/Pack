import Head from "next/head";
import coordsToTilePng from "../lib/coordsToTilePng";
import findCenter from "../lib/findCentre";

export default function EventMetaTags({ event }) {
    const centerPoint = findCenter(event.coordinates);
    return (
        <Head>
        <meta
          property="og:title"
          content={`Pack - ${event.description.name}`}
        />
        <meta
          property="og:description"
          content={event.description.description}
        />
        <meta
          property="og:image"
          content={coordsToTilePng(centerPoint.lat, centerPoint.lng, 7)}
        />
      </Head>
    )
}