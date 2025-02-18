import { Image } from "@shopify/hydrogen";

export default function AllCollections({ collectionData }: { collectionData: any }) {
  return (
    <main>
           <Image src='/assets/collections.png' alt='all colection iamge' width='600px'/>
           <ul>
            {
              collectionData.edges.map((collection: any) => {
                return (
                  <li key={collection.node.id}>
                    <Image src={collection.node.image.originalSrc} alt='collection image' width='600px'/>
                    <h2>{collection.node.title}</h2>
                    <p>{collection.node.description}</p>
                  </li>
                )
              })
            }
           </ul>
    </main>
  )
}
