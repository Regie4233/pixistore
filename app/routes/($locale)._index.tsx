import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link, type MetaFunction } from '@remix-run/react';
import { Suspense } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import { HeroSection } from '~/components/landing/HeroSection';
import NewArrivals from '~/components/landing/NewArrivals';
import HotItems from '~/components/landing/HotItems';
import AllCollections from '~/components/landing/AllCollections';
import { ShowCollection } from '~/components/shop/ShowCollection';

export const meta: MetaFunction = () => {
  return [{ title: 'Hydrogen | Home' }];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  // const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // return defer({...deferredData, ...criticalData});
  // return defer({...deferredData});
  return defer({ ...criticalData });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: LoaderFunctionArgs) {
  const [{ collections }, data] = await Promise.all([
    context.storefront.query(ALL_COLLECTIONS_QUERY,{
      variables: {
        first: 20,
        after: null
      }
    }),

    // Add other queries here, so that they are loaded in parallel
    context.storefront
      .query(ALL_PRODUCTS_QUERY, {
        variables: {
          first: 3,
          after: null
        }
      })
  ]);
  // const latestProduct = context.storefront
  //   .query(ALL_PRODUCTS_QUERY, {
  //     variables: {
  //       first: 10,
  //       after: null
  //     }
  //   })
  //   .catch((error) => {
  //     // Log query errors, but don't throw them so the page can still render
  //     console.error(error);
  //     return null;
  //   });
  return {
    featuredCollection: collections,
    allProducts: data
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  const latestProduct = context.storefront
    .query(GET_RECENT_PRODUCTS, {
      variables: {
        first: 3,
      }
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    latestProduct,
    recommendedProducts
  };
}

export default function Homepage() {
  // const {latestProduct, recommendedProducts} = useLoaderData<typeof loader>();
  const { featuredCollection, allProducts } = useLoaderData<typeof loader>();
  console.log(allProducts.products.edges);
  // console.log(recommendedProducts);
  return (
    <div className="homexxx">
      <HeroSection />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <NewArrivals productData={allProducts.products.edges} />
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
      <HotItems productData={allProducts.products.edges} />
      {/* <FeaturedCollection collection={featuredCollection} /> */}
      <AllCollections collectionData={featuredCollection} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  console.log(collection);
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                  <Link
                    key={product.id}
                    className="recommended-product"
                    to={`/products/${product.handle}`}
                  >
                    <Image
                      data={product.images.nodes[0]}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                    <h4>{product.title}</h4>
                    <small>
                      <Money data={product.priceRange.minVariantPrice} />
                    </small>
                  </Link>
                ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const ALL_COLLECTIONS_QUERY = `#graphql
query GetAllCollections($first: Int!, $after: String, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  collections(first: $first, after: $after) {
    edges {
      node {
        id
        title
        handle
        description
        image {
          originalSrc # Or url if you prefer
          altText
          width
          height
        }
        # Add other collection fields you need here
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`


const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;


const COLLECTIONS_QUERYTWO = `#graphql
  query {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
` as const;

const ALL_PRODUCTS_QUERY = `#graphql
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            nodes {
              url
              altText
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor 
      }
    }
  }
` as const;

const GET_RECENT_PRODUCTS = `#graphql
query RecentlyAddedProducts($first: Int!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  products(first: $first, sortKey: CREATED_AT, reverse: true) {
    edges {
      node {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          nodes {
            url
            altText
          }
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`as const;