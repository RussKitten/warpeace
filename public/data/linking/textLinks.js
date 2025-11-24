import { textLinksMap } from './textLinksMap.js';

export function generateTextLink(textLink) {
  return getTextLinkWithFallback(textLink);
}

export function getTextLinkWithFallback(textLink) {
  const mapping = textLinksMap[textLink];
  if (mapping && mapping.page) {
    // Ссылка на конкретную страницу в PDF
    return `/data/text.pdf#page=${mapping.page}`;
  }
  // Запасной вариант - просто ссылка на PDF
  return '/data/text.pdf';
}

export function getTextLinkDescription(textLink) {
  return textLinksMap[textLink]?.description || 'Фрагмент романа';
}

export function formatTextLink(textLink) {
  const parts = textLink.split('.');
  if (parts[0] === 'E') {
    return `Эпилог, часть ${parts[1]}, глава ${parts[2]}`;
  }
  return `Том ${parts[0]}, часть ${parts[1]}, глава ${parts[2]}`;
}