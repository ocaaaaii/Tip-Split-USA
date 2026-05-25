// The core proportional tax+tip split algorithm

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[];   // participant IDs
}

export interface Participant {
  id: string;
  name: string;
  color: string;
}

export interface ParticipantSplit {
  participant: Participant;
  subtotal: number;
  taxShare: number;
  tipShare: number;
  total: number;
  items: { name: string; price: number; shared?: boolean }[];
  isRemainder?: boolean;
}

/**
 * Core split algorithm (proportional tax+tip).
 * Each item is split equally among its assignedTo participants.
 * Tax and tip are distributed proportionally to each person's food share.
 */
export function calculateItemizedSplit(
  items: ReceiptItem[],
  participants: Participant[],
  totalTax: number,
  totalTip: number,
): ParticipantSplit[] {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  if (subtotal === 0 || participants.length === 0) return [];

  const participantMap: Record<string, {
    subtotal: number;
    items: { name: string; price: number; shared?: boolean }[];
  }> = {};
  participants.forEach((p) => { participantMap[p.id] = { subtotal: 0, items: [] }; });

  for (const item of items) {
    if (item.assignedTo.length === 0) continue;
    const share = item.price / item.assignedTo.length;
    const isShared = item.assignedTo.length > 1;

    for (const pid of item.assignedTo) {
      if (!participantMap[pid]) continue;
      participantMap[pid].subtotal = round2(participantMap[pid].subtotal + share);
      participantMap[pid].items.push({
        name: item.name,
        price: round2(share),
        shared: isShared,
      });
    }
  }

  const rawSplits: ParticipantSplit[] = participants.map((p) => {
    const pSubtotal = participantMap[p.id]?.subtotal ?? 0;
    const ratio = subtotal > 0 ? pSubtotal / subtotal : 0;
    const taxShare = round2(totalTax * ratio);
    const tipShare = round2(totalTip * ratio);
    return {
      participant: p,
      subtotal: pSubtotal,
      taxShare,
      tipShare,
      total: round2(pSubtotal + taxShare + tipShare),
      items: participantMap[p.id]?.items ?? [],
    };
  });

  // 1-cent rounding fix — assign remainder to first person
  const computedTotal = round2(rawSplits.reduce((s, r) => s + r.total, 0));
  const expectedTotal = round2(subtotal + totalTax + totalTip);
  const remainder = round2(expectedTotal - computedTotal);
  if (remainder !== 0 && rawSplits.length > 0) {
    rawSplits[0].total = round2(rawSplits[0].total + remainder);
    rawSplits[0].isRemainder = true;
  }
  return rawSplits;
}

export function calculateEvenSplit(
  subtotal: number, taxAmount: number, tipAmount: number, numPeople: number,
): { perPerson: number; ownerTotal: number; remainder: number } {
  const grandTotal = round2(subtotal + taxAmount + tipAmount);
  const perPerson = Math.floor((grandTotal / numPeople) * 100) / 100;
  const remainder = round2(grandTotal - perPerson * numPeople);
  return { perPerson, ownerTotal: round2(perPerson + remainder), remainder };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }

export const PARTICIPANT_COLORS = [
  '#688DA5', '#3D1D0A', '#C4581A', '#7A9E7E',
  '#8B6B9E', '#9E6B6B', '#4A7A88', '#A07858',
];
