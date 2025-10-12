// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { Commit } from '../resources/types';
import fakeDelay from './utils/fake-delay';
import fetchJson from './utils/fetch-json';
import paginate from './utils/paginate';

export async function fetchCommits({
  filteringText,
  currentPageIndex,
  pageSize = 100,
}: {
  filteringText?: string;
  currentPageIndex: number;
  pageSize?: number;
}) {
  const [items] = await Promise.all([
    fetchJson<Commit[]>('/src/resources/commits.json'),
    fakeDelay(),
  ]);
  
  const filteredItems = filteringText 
    ? items.filter(item => 
        item.message.toLowerCase().includes(filteringText.toLowerCase()) ||
        item.author.toLowerCase().includes(filteringText.toLowerCase()) ||
        item.branch.toLowerCase().includes(filteringText.toLowerCase()) ||
        item.hash.toLowerCase().includes(filteringText.toLowerCase())
      ) 
    : items;
  
  const { paginatedItems, hasNextPage } = paginate(filteredItems, currentPageIndex, pageSize);
  
  return { 
    commits: paginatedItems, 
    hasNextPage,
    totalCount: filteredItems.length 
  };
}
