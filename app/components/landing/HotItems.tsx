import { Image, Money } from '@shopify/hydrogen';



// Render the component using data returned by the loader
export default function HotItems({ productData }: { productData: any }) {
  if (!productData) return;
  // const items = productData._data;
  // console.log(productData._data);

  console.log(productData)

  return (
    <main className='m-8'>
      <ul className='flex flex-row items-center gap-4 m-12 p-4'>
        {
          productData.map((product: any) => {
            const price: any = product.node.priceRange.minVariantPrice;
            return (
              <li key={product.cursor} className='text-center'>
                <Image src={product.node.images.nodes[0].url} alt='new arrivals image' width='600px'/>
                <h2 className=''>{product.node.title}</h2>
              
                  <Money data={price} />
              
              </li>
            )
          })
        }
          <li className='flex flex-col items-center gap-4 mystery-quest-regular'>
          <Image src='/assets/hotitems.png' alt='new arrivals image' width='600px'/>
          <a href='/' className=' text-xl bg-[#D9EAD3] px-14 py-2'>Browse</a>
        </li>
      </ul>

    </main>

  )
}
