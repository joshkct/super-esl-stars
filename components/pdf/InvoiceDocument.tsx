import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { EnglishLevel, SessionDuration } from '@/types';

/**
 * React PDF invoice template for Verbjective.
 *
 * Rendered server-side via `lib/invoice.ts`. Amounts are received in ZAR cents
 * and formatted to rands here. Branding is a placeholder pending final assets.
 */
export interface InvoiceData {
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  issueDate: string; // ISO date
  dueDate: string; // ISO date
  amountZarCents: number;
  session?: {
    date: string; // ISO date
    durationMinutes: SessionDuration;
    level: EnglishLevel;
  } | null;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, color: '#0f172a', fontFamily: 'Helvetica' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brand: { fontSize: 22, fontWeight: 'bold', color: '#1f44c8' },
  brandSub: { fontSize: 9, color: '#475569', marginTop: 2 },
  invoiceMeta: { textAlign: 'right' },
  h2: { fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  section: { marginBottom: 18 },
  muted: { color: '#475569' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottom: '1px solid #e2e8f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 8,
    borderTop: '2px solid #0f172a',
  },
  total: { fontSize: 14, fontWeight: 'bold' },
  footer: { marginTop: 40, fontSize: 9, color: '#94a3b8', textAlign: 'center' },
});

function formatRand(cents: number): string {
  return `R ${(cents / 100).toFixed(2)}`;
}

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  return (
    <Document title={`Invoice ${data.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Verbjective</Text>
            <Text style={styles.brandSub}>Online English Tutoring</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.h2}>INVOICE</Text>
            <Text>{data.invoiceNumber}</Text>
            <Text style={styles.muted}>Issued: {data.issueDate}</Text>
            <Text style={styles.muted}>Due: {data.dueDate}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Billed to</Text>
          <Text>{data.studentName}</Text>
          <Text style={styles.muted}>{data.studentEmail}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Details</Text>
          {data.session ? (
            <View style={styles.row}>
              <Text>
                English session ({data.session.level},{' '}
                {data.session.durationMinutes} min) on {data.session.date}
              </Text>
              <Text>{formatRand(data.amountZarCents)}</Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Text>Tutoring services</Text>
              <Text>{formatRand(data.amountZarCents)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.total}>Total due</Text>
            <Text style={styles.total}>{formatRand(data.amountZarCents)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for learning with Verbjective. Payment due by{' '}
          {data.dueDate}.
        </Text>
      </Page>
    </Document>
  );
}

export default InvoiceDocument;
