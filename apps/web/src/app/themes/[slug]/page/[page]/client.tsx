'use client';

import JsonLd from '@/components/json-ld';
import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionPaginationControllers, SectionWrapper } from '@/components/ui/section-wrapper';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { SITE_URL } from '@/constants/GLOBALS';
import { getThemePoems } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toArabicDigits } from 'to-arabic-digits';

export const runtime = 'edge';

export default function ThemePoemsSlugClientPage() {
  const params = useParams();

  const slug = params?.slug as string;
  const pageParam = params?.page as string;
  const pageNumber = pageParam ? Number.parseInt(pageParam, 10) : 1;

  const isValidSlug = Boolean(slug);
  const isValidPage = Number.isFinite(pageNumber) && pageNumber > 0;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['theme-poems-slugged-paginated', slug, pageNumber],
    queryFn: () => getThemePoems(slug, pageNumber.toString()),
  });

  // Handle loading state
  if (isLoading) {
    return <SectionSkeleton title="قصائد غرض بعينه" itemsCount={10} />;
  }

  // Handle error state
  if (isError || !data || !isValidPage || !isValidSlug) {
    return (
      <SectionWrapper>
        <ErrorMessage />
      </SectionWrapper>
    );
  }

  const { data: themeData, pagination } = data;
  const { themeDetails, poems } = themeData;

  // Use API pagination metadata if available
  const totalPages = pagination?.totalPages || Math.ceil(themeDetails.poemsCount / 30);
  const hasNextPage = pagination?.hasNextPage || pageNumber < totalPages;
  const hasPrevPage = pagination?.hasPrevPage || pageNumber > 1;

  const nextPageUrl = `/themes/${slug}/page/${pageNumber + 1}`;
  const prevPageUrl = `/themes/${slug}/page/${pageNumber - 1}`;

  const content = {
    header: `قصائد ${themeDetails.name} (${toArabicDigits(themeDetails.poemsCount)} قصيدة)`,
    headerTip: `صـ ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
    next: 'التالي',
    previous: 'السابق',
    noMore: 'لا توجد قصائد لهذا الغرض.',
  };

  const itemListElements = poems.map((poem, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CreativeWork',
      name: poem.title,
      url: `${SITE_URL}/poems/${poem.slug}`,
    },
  }));

  // Create the JSON-LD object with dynamic data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Collection',
    name: `قصائد ${themeDetails.name}`,
    url: `${SITE_URL}/themes/${slug}/page/${pageNumber}`,
    description: `مجموعة قصائد ${themeDetails.name} - الصفحة ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
    mainEntityOfPage: {
      '@type': 'CollectionPage',
      name: `قصائد ${themeDetails.name}`,
      url: `${SITE_URL}/themes/${slug}/page/1`,
    },
    numberOfItems: themeDetails.poemsCount,
    itemListElement: itemListElements,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <SectionWrapper
        dynamicTitle={content.header}
        pagination={{
          totalPages,
          component: (
            <SectionPaginationControllers
              headerTip={content.headerTip}
              nextPageUrl={nextPageUrl}
              prevPageUrl={prevPageUrl}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
            />
          ),
        }}
      >
        {poems.length > 0 ? (
          poems.map((poem) => (
            <ListCard
              key={poem.slug}
              href={`/poems/${poem.slug}`}
              name={poem.title}
              title={`${poem.poetName} • ${poem.meter}`}
            />
          ))
        ) : (
          <p className="text-center text-zinc-500">{content.noMore}</p>
        )}
      </SectionWrapper>
    </>
  );
}
