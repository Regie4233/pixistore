import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, Link, type MetaFunction, Await } from '@remix-run/react';
import { getPaginationVariables, Image, Money } from '@shopify/hydrogen';
import { resolve } from 'styled-jsx/css';



// Render the component using data returned by the loader
export default function NewArrivals({ productData }: { productData: any }) {
  if (!productData) return;
  // const items = productData._data;
  // console.log(productData._data);

  console.log(productData)

  return (
    <main className='bg-[#FCE3DF] m-8'>
      <ul className='flex flex-row items-center gap-4 m-12 p-4'>
        <li className='flex flex-col items-center gap-4 mystery-quest-regular'>
          <Image src='/assets/newarr.png' alt='new arrivals image' width='600px'/>
          <a href='/' className=' text-xl bg-[#FFF2CC] px-14 py-2'>Browse</a>
        </li>
        {
          productData.map((product: any) => {
            const price: any = product.node.priceRange.minVariantPrice;
            return (
              <li key={product.id} className='text-center'>
                <Image src={product.node.images.nodes[0].url} alt='new arrivals image' width='600px'/>
                <h2 className=''>{product.node.title}</h2>
              
                  <Money data={price} />
              
              </li>
            )
          })
        }
      </ul>

    </main>

  )
}
