import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Path, Circle as SvgCircle } from 'react-native-svg';
import { FamilyMember, FamilyCategory } from '../types/familyTypes';
import { familyMembers } from '../data/family';
import { Theme } from '../i18n/themes';
import { TranslationLang } from '../i18n/translations';

interface FamilyTreeProps {
  theme: Theme;
  translationLang: TranslationLang;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Canvas dimensions
const CANVAS_W = 1000;
const CANVAS_H = 640;

// Node positions { x, y } = center of circle
const POS = {
  // Grandparents
  patGF:    { x: 190, y: 55 },
  patGM:    { x: 330, y: 55 },
  matGF:    { x: 670, y: 55 },
  matGM:    { x: 810, y: 55 },

  // Parents & Aunts/Uncles
  patAunt:  { x: 130, y: 190 },
  father:   { x: 260, y: 190 },
  patUncle: { x: 390, y: 190 },
  matAunt:  { x: 610, y: 190 },
  mother:   { x: 740, y: 190 },
  matUncle: { x: 870, y: 190 },

  // Me & Siblings
  brother:  { x: 310, y: 360 },
  sister:   { x: 400, y: 360 },
  me:       { x: 500, y: 355 },
  spouse:   { x: 620, y: 360 },
  cousin:   { x: 730, y: 360 },

  // In-laws
  fil:      { x: 730, y: 460 },
  mil:      { x: 840, y: 460 },

  // Children
  son:      { x: 440, y: 490 },
  daughter: { x: 560, y: 490 },

  // Grandchild
  grandchild: { x: 500, y: 590 },
};

// Branch Y levels
const BRANCH = {
  gpToParents: 120,        // grandparents → parents
  parentsToMarriage: 255,  // parents → marriage point
  marriagePoint: 270,      // where father+mother lines meet
  marriageToKids: 305,     // marriage → me/siblings
  meToChildren: 430,       // me → children
  childToGrandchild: 545,  // children → grandchild
  spouseToInlaws: 415,     // spouse → in-laws
};

const categoryLabels: Record<FamilyCategory, { en: string; fr: string }> = {
  immediate: { en: 'Immediate Family', fr: 'Famille immédiate' },
  grandparents: { en: 'Grandparents & Grandchildren', fr: 'Grands-parents et petits-enfants' },
  extended: { en: 'Extended Family', fr: 'Famille élargie' },
  'in-laws': { en: 'In-Laws', fr: 'Belle-famille' },
  other: { en: 'Other', fr: 'Autre' },
};

const categoryOrder: FamilyCategory[] = ['immediate', 'grandparents', 'extended', 'in-laws', 'other'];

export const FamilyTree: React.FC<FamilyTreeProps> = ({ theme, translationLang }) => {
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const getMember = (id: string) => familyMembers.find(m => m.id === id);

  const getTranslation = (member: FamilyMember): string => {
    if (translationLang === 'fr') return member.french;
    if (translationLang === 'both') return `${member.english} / ${member.french}`;
    return member.english;
  };

  const getDescription = (member: FamilyMember): string => {
    if (translationLang === 'fr') return member.descriptionFrench;
    return member.description;
  };

  const getCategoryLabel = (cat: FamilyCategory): string => {
    if (translationLang === 'fr') return categoryLabels[cat].fr;
    return categoryLabels[cat].en;
  };

  const genderColor = (gender?: string) => {
    if (gender === 'male') return '#3b82f6';
    if (gender === 'female') return '#ec4899';
    return '#a855f7';
  };

  const genderBg = (gender?: string) => {
    if (gender === 'male') return '#dbeafe';
    if (gender === 'female') return '#fce7f3';
    return '#f3e8ff';
  };

  const genderIcon = (gender?: string) => {
    if (gender === 'male') return '👨';
    if (gender === 'female') return '👩';
    return '👤';
  };

  const lineColor = theme.border;
  const lineWidth = 2;

  // Draw a straight line
  const drawLine = (x1: number, y1: number, x2: number, y2: number, color?: string) => (
    <Line
      key={`${x1}-${y1}-${x2}-${y2}`}
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color || lineColor}
      strokeWidth={lineWidth}
    />
  );

  // Draw couple horizontal line
  const drawCoupleLine = (p1: {x: number, y: number}, p2: {x: number, y: number}, r: number = 30) => (
    drawLine(p1.x + r, p1.y, p2.x - r, p2.y, '#e879a0')
  );

  // Draw parent-to-children branch:
  // 1. Vertical from couple midpoint down to branch level
  // 2. Horizontal across all children at branch level
  // 3. Vertical ticks from branch level down to each child
  const drawBranch = (
    parentMidX: number,
    parentY: number,
    branchY: number,
    childPositions: {x: number, y: number}[],
    childR: number = 28
  ) => {
    const lines: React.ReactNode[] = [];
    const key = `branch-${parentMidX}-${branchY}`;

    // Vertical from parent down to branch
    lines.push(
      <Line key={`${key}-v`} x1={parentMidX} y1={parentY} x2={parentMidX} y2={branchY}
        stroke={lineColor} strokeWidth={lineWidth} />
    );

    // Horizontal line spanning all children
    const leftX = Math.min(...childPositions.map(p => p.x));
    const rightX = Math.max(...childPositions.map(p => p.x));
    lines.push(
      <Line key={`${key}-h`} x1={leftX} y1={branchY} x2={rightX} y2={branchY}
        stroke={lineColor} strokeWidth={lineWidth} />
    );

    // Vertical ticks down to each child
    childPositions.forEach((pos, i) => {
      lines.push(
        <Line key={`${key}-t${i}`} x1={pos.x} y1={branchY} x2={pos.x} y2={pos.y - childR}
          stroke={lineColor} strokeWidth={lineWidth} />
      );
    });

    return lines;
  };

  // Render a node (circle + text) as absolute positioned View
  const renderNode = (
    member: FamilyMember | undefined,
    pos: {x: number, y: number},
    size: number = 56
  ) => {
    if (!member) return null;
    const r = size / 2;
    const color = genderColor(member.gender);
    const bg = genderBg(member.gender);
    const iconSize = size > 50 ? 24 : 18;
    const textSize = size > 50 ? 10 : 8;

    return (
      <TouchableOpacity
        key={member.id}
        onPress={() => setSelectedMember(member)}
        style={[
          styles.absoluteNode,
          { left: pos.x - r - 12, top: pos.y - r - 4, width: size + 24 },
        ]}
      >
        <View
          style={[
            styles.nodeCircle,
            {
              width: size,
              height: size,
              borderRadius: r,
              borderColor: color,
              backgroundColor: bg,
            },
          ]}
        >
          <Text style={{ fontSize: iconSize }}>{genderIcon(member.gender)}</Text>
        </View>
        <Text
          style={[styles.nodeKirundi, { color: theme.title, fontSize: textSize + 1 }]}
          numberOfLines={2}
        >
          {member.kirundi}
        </Text>
        <Text
          style={[styles.nodeTranslation, { color: theme.subtext, fontSize: textSize - 1 }]}
          numberOfLines={1}
        >
          {getTranslation(member)}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render ME node (special)
  const renderMe = () => {
    const pos = POS.me;
    const size = 70;
    const r = size / 2;

    return (
      <View
        key="me"
        style={[
          styles.absoluteNode,
          { left: pos.x - r - 12, top: pos.y - r - 22, width: size + 24 },
        ]}
      >
        <View style={[styles.meBadge, { backgroundColor: theme.accent }]}>
          <Text style={[styles.meText, { color: theme.accentText }]}>JE / ME</Text>
        </View>
        <View
          style={[
            styles.nodeCircle,
            {
              width: size,
              height: size,
              borderRadius: r,
              borderColor: theme.accent,
              borderWidth: 3,
              backgroundColor: theme.card,
            },
          ]}
        >
          <Text style={{ fontSize: 32 }}>🧑</Text>
        </View>
      </View>
    );
  };

  // Section label positioned on the canvas
  const renderLabel = (text: string, x: number, y: number) => (
    <View key={`label-${text}`} style={[styles.canvasLabel, { left: x, top: y }]}>
      <View style={[styles.labelBadge, { backgroundColor: theme.badge }]}>
        <Text style={[styles.labelText, { color: theme.badgeText }]}>{text}</Text>
      </View>
    </View>
  );

  // Side label
  const renderSideLabel = (text: string, x: number, y: number) => (
    <View key={`side-${text}`} style={[styles.canvasLabel, { left: x, top: y }]}>
      <Text style={[styles.sideLabel, { color: theme.subtext }]}>{text}</Text>
    </View>
  );

  // Heart/ring icon on couple line
  const renderCoupleIcon = (x: number, y: number, icon: string = '💑') => (
    <View key={`couple-${x}-${y}`} style={[styles.coupleIcon, { left: x - 13, top: y - 13 }]}>
      <View style={[styles.coupleIconBg, { backgroundColor: theme.card }]}>
        <Text style={{ fontSize: 12 }}>{icon}</Text>
      </View>
    </View>
  );

  const renderTreeView = () => {
    // Members
    const patGF = getMember('8');
    const patGM = getMember('9');
    const matGF = getMember('23');
    const matGM = getMember('24');
    const father = getMember('1');
    const mother = getMember('2');
    const patAunt = getMember('13');
    const patUncle = getMember('11');
    const matAunt = getMember('14');
    const matUncle = getMember('12');
    const brother = getMember('5');
    const sister = getMember('6');
    const spouse = getMember('22');
    const cousin = getMember('15');
    const fatherInLaw = getMember('17');
    const motherInLaw = getMember('18');
    const son = getMember('3');
    const daughter = getMember('4');
    const grandchild = getMember('10');

    // Midpoints
    const patCoupleMidX = (POS.patGF.x + POS.patGM.x) / 2;
    const matCoupleMidX = (POS.matGF.x + POS.matGM.x) / 2;
    const marriageMidX = 500;
    const meSpouseMidX = (POS.me.x + POS.spouse.x) / 2;
    const childrenMidX = (POS.son.x + POS.daughter.x) / 2;
    const spouseMidX = POS.spouse.x;

    return (
      <ScrollView style={styles.treeScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={[styles.treeCanvas, { width: CANVAS_W, height: CANVAS_H }]}>

            {/* === SVG LAYER (lines) === */}
            <Svg width={CANVAS_W} height={CANVAS_H} style={StyleSheet.absoluteFill}>

              {/* Paternal couple line */}
              {drawCoupleLine(POS.patGF, POS.patGM)}

              {/* Maternal couple line */}
              {drawCoupleLine(POS.matGF, POS.matGM)}

              {/* Paternal grandparents → their children */}
              {drawBranch(
                patCoupleMidX, POS.patGF.y + 28,
                BRANCH.gpToParents,
                [POS.patAunt, POS.father, POS.patUncle],
                28
              )}

              {/* Maternal grandparents → their children */}
              {drawBranch(
                matCoupleMidX, POS.matGF.y + 28,
                BRANCH.gpToParents,
                [POS.matAunt, POS.mother, POS.matUncle],
                28
              )}

              {/* Father → marriage point (L-shape) */}
              {drawLine(POS.father.x, POS.father.y + 28, POS.father.x, BRANCH.parentsToMarriage)}
              {drawLine(POS.father.x, BRANCH.parentsToMarriage, marriageMidX, BRANCH.parentsToMarriage)}
              {drawLine(marriageMidX, BRANCH.parentsToMarriage, marriageMidX, BRANCH.marriagePoint)}

              {/* Mother → marriage point (L-shape) */}
              {drawLine(POS.mother.x, POS.mother.y + 28, POS.mother.x, BRANCH.parentsToMarriage)}
              {drawLine(POS.mother.x, BRANCH.parentsToMarriage, marriageMidX, BRANCH.parentsToMarriage)}

              {/* Marriage → children branch */}
              {drawBranch(
                marriageMidX, BRANCH.marriagePoint,
                BRANCH.marriageToKids,
                [POS.brother, POS.sister, POS.me],
                28
              )}

              {/* Me → Spouse horizontal line */}
              {drawLine(POS.me.x + 35, POS.me.y + 5, POS.spouse.x - 28, POS.spouse.y, '#e879a0')}

              {/* Me+Spouse → children */}
              {drawBranch(
                meSpouseMidX, POS.me.y + 40,
                BRANCH.meToChildren,
                [POS.son, POS.daughter],
                28
              )}

              {/* Children → grandchild */}
              {drawBranch(
                childrenMidX, POS.son.y + 28,
                BRANCH.childToGrandchild,
                [POS.grandchild],
                23
              )}

              {/* Spouse → in-laws */}
              {drawLine(spouseMidX, POS.spouse.y + 28, spouseMidX, BRANCH.spouseToInlaws)}
              {drawLine(POS.fil.x, BRANCH.spouseToInlaws, POS.mil.x, BRANCH.spouseToInlaws)}
              {drawLine(POS.fil.x, BRANCH.spouseToInlaws, POS.fil.x, POS.fil.y - 23)}
              {drawLine(POS.mil.x, BRANCH.spouseToInlaws, POS.mil.x, POS.mil.y - 23)}

              {/* Cousin line from maternal side */}
              {drawLine(POS.matUncle.x, POS.matUncle.y + 28, POS.matUncle.x, BRANCH.marriageToKids)}
              {drawLine(POS.matUncle.x, BRANCH.marriageToKids, POS.cousin.x, BRANCH.marriageToKids)}
              {drawLine(POS.cousin.x, BRANCH.marriageToKids, POS.cousin.x, POS.cousin.y - 28)}

            </Svg>

            {/* === NODE LAYER (circles + text) === */}

            {/* Labels */}
            {renderSideLabel('PATERNAL SIDE', 160, 10)}
            {renderSideLabel('MATERNAL SIDE', 660, 10)}
            {renderLabel('Grandparents', 430, 2)}
            {renderLabel('Parents & Uncles/Aunts', 400, 140)}
            {renderLabel('Me & Family', 440, 290)}
            {renderLabel('Children', 450, 455)}
            {renderLabel('In-Laws', 760, 425)}

            {/* Couple icons */}
            {renderCoupleIcon((POS.patGF.x + POS.patGM.x) / 2, POS.patGF.y)}
            {renderCoupleIcon((POS.matGF.x + POS.matGM.x) / 2, POS.matGF.y)}
            {renderCoupleIcon(marriageMidX, BRANCH.marriagePoint - 5, '💑')}
            {renderCoupleIcon((POS.me.x + POS.spouse.x) / 2 + 5, POS.me.y + 2, '💍')}

            {/* Grandparents */}
            {renderNode(patGF, POS.patGF, 56)}
            {renderNode(patGM, POS.patGM, 56)}
            {renderNode(matGF, POS.matGF, 56)}
            {renderNode(matGM, POS.matGM, 56)}

            {/* Parents & Aunts/Uncles */}
            {renderNode(patAunt, POS.patAunt, 50)}
            {renderNode(father, POS.father, 60)}
            {renderNode(patUncle, POS.patUncle, 50)}
            {renderNode(matAunt, POS.matAunt, 50)}
            {renderNode(mother, POS.mother, 60)}
            {renderNode(matUncle, POS.matUncle, 50)}

            {/* Me & Siblings */}
            {renderNode(brother, POS.brother, 52)}
            {renderNode(sister, POS.sister, 52)}
            {renderMe()}
            {renderNode(spouse, POS.spouse, 56)}
            {renderNode(cousin, POS.cousin, 48)}

            {/* In-laws */}
            {renderNode(fatherInLaw, POS.fil, 48)}
            {renderNode(motherInLaw, POS.mil, 48)}

            {/* Children */}
            {renderNode(son, POS.son, 56)}
            {renderNode(daughter, POS.daughter, 56)}

            {/* Grandchild */}
            {renderNode(grandchild, POS.grandchild, 48)}
          </View>
        </ScrollView>
      </ScrollView>
    );
  };

  const renderListView = () => {
    return (
      <ScrollView style={styles.listContainer}>
        {categoryOrder.map(cat => {
          const members = familyMembers.filter(m => m.category === cat);
          if (members.length === 0) return null;

          return (
            <View key={cat} style={styles.categorySection}>
              <Text style={[styles.categoryTitle, { color: theme.title }]}>
                {getCategoryLabel(cat)}
              </Text>
              {members.map(member => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => setSelectedMember(member)}
                  style={[styles.listItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <View style={[styles.listIconCircle, { backgroundColor: genderBg(member.gender), borderColor: genderColor(member.gender) }]}>
                    <Text style={{ fontSize: 22 }}>{genderIcon(member.gender)}</Text>
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={[styles.listKirundi, { color: theme.title }]}>{member.kirundi}</Text>
                    <Text style={[styles.listTranslation, { color: theme.text }]}>
                      {getTranslation(member)}
                    </Text>
                  </View>
                  <View style={styles.listRight}>
                    <Text style={[styles.listPronunciation, { color: theme.subtext }]}>
                      /{member.pronunciation}/
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.subtext }}>→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Toggle */}
      <View style={[styles.toggleContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          onPress={() => setViewMode('tree')}
          style={[styles.toggleButton, { borderColor: theme.border },
            viewMode === 'tree' && { backgroundColor: theme.accent, borderColor: theme.accent }]}
        >
          <Text style={[styles.toggleText, { color: theme.text },
            viewMode === 'tree' && { color: theme.accentText }]}>
            🌳 Tree View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode('list')}
          style={[styles.toggleButton, { borderColor: theme.border },
            viewMode === 'list' && { backgroundColor: theme.accent, borderColor: theme.accent }]}
        >
          <Text style={[styles.toggleText, { color: theme.text },
            viewMode === 'list' && { color: theme.accentText }]}>
            📋 List View
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'tree' && (
        <Text style={[styles.scrollHint, { color: theme.subtext }]}>
          ← Scroll left & right, up & down →
        </Text>
      )}

      {viewMode === 'tree' ? renderTreeView() : renderListView()}

      {/* Modal */}
      <Modal visible={selectedMember !== null} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedMember(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={[styles.modalCircle, { borderColor: genderColor(selectedMember?.gender), backgroundColor: genderBg(selectedMember?.gender) }]}>
              <Text style={{ fontSize: 36 }}>{genderIcon(selectedMember?.gender)}</Text>
            </View>
            <Text style={[styles.modalKirundi, { color: theme.title }]}>{selectedMember?.kirundi}</Text>
            <Text style={[styles.modalPronunciation, { color: theme.subtext }]}>
              /{selectedMember?.pronunciation}/
            </Text>
            <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />
            <Text style={[styles.modalTranslation, { color: theme.text }]}>
              {selectedMember && getTranslation(selectedMember)}
            </Text>
            <View style={[styles.modalDescBox, { backgroundColor: theme.bg }]}>
              <Text style={[styles.modalDescription, { color: theme.subtext }]}>
                {selectedMember && getDescription(selectedMember)}
              </Text>
            </View>
            <Text style={[styles.modalDismiss, { color: theme.subtext }]}>Tap anywhere to close</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  toggleContainer: {
    flexDirection: 'row', margin: 12, marginBottom: 4,
    borderRadius: 10, padding: 4, gap: 4,
  },
  toggleButton: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    alignItems: 'center', borderWidth: 1,
  },
  toggleText: { fontSize: 14, fontWeight: '600' },
  scrollHint: { textAlign: 'center', fontSize: 12, marginBottom: 4 },

  // Tree
  treeScroll: { flex: 1 },
  treeCanvas: { position: 'relative' },

  // Absolute node
  absoluteNode: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  nodeCircle: {
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeKirundi: {
    fontWeight: '700',
    marginTop: 3,
    textAlign: 'center',
  },
  nodeTranslation: {
    textAlign: 'center',
    marginTop: 1,
  },

  // ME
  meBadge: {
    paddingHorizontal: 10, paddingVertical: 2,
    borderRadius: 8, marginBottom: 4,
  },
  meText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  // Labels on canvas
  canvasLabel: { position: 'absolute', zIndex: 5 },
  labelBadge: {
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  labelText: {
    fontSize: 10, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  sideLabel: {
    fontSize: 10, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Couple icon overlay
  coupleIcon: { position: 'absolute', zIndex: 15 },
  coupleIconBg: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },

  // List View
  listContainer: { flex: 1, padding: 12 },
  categorySection: { marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, paddingLeft: 4 },
  listItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 6,
  },
  listIconCircle: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  listInfo: { flex: 1 },
  listKirundi: { fontSize: 16, fontWeight: '600' },
  listTranslation: { fontSize: 14, marginTop: 2 },
  listRight: { alignItems: 'flex-end', gap: 4 },
  listPronunciation: { fontSize: 11, fontStyle: 'italic' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16, padding: 24, width: '82%', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 10,
  },
  modalCircle: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  modalKirundi: { fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  modalPronunciation: { fontSize: 14, fontStyle: 'italic', marginBottom: 12 },
  modalDivider: { height: 1, width: '100%', marginBottom: 12 },
  modalTranslation: { fontSize: 20, fontWeight: '500', marginBottom: 12, textAlign: 'center' },
  modalDescBox: { borderRadius: 8, padding: 12, width: '100%', marginBottom: 16 },
  modalDescription: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  modalDismiss: { fontSize: 12 },
});