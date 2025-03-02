
import { FamilyMember, Relationship } from "../types";

export const processDataForD3 = (members: FamilyMember[], relationships: Relationship[]) => {
  if (members.length === 0) return null;

  // Use the first member as the root
  const rootMember = members[0];
  
  const processedData = {
    name: `${rootMember.first_name} ${rootMember.last_name}`,
    gender: rootMember.gender || 'unknown',
    id: rootMember.id,
    children: []
  };

  // Find spouse relationships
  const spouseRelationships = relationships.filter(rel => 
    (rel.relationship_type === 'spouse' && 
    (rel.person1_id === rootMember.id || rel.person2_id === rootMember.id))
  );

  if (spouseRelationships.length > 0) {
    const spouseNode = {
      name: "Spouse",
      virtual: true,
      children: spouseRelationships.map(rel => {
        const spouseId = rel.person1_id === rootMember.id ? rel.person2_id : rel.person1_id;
        const spouse = members.find(m => m.id === spouseId);
        if (!spouse) return null;
        return {
          name: `${spouse.first_name} ${spouse.last_name}`,
          gender: spouse.gender || 'unknown',
          id: spouse.id,
          relationship: 'spouse'
        };
      }).filter(Boolean)
    };
    
    if (spouseNode.children.length > 0) {
      processedData.children.push(spouseNode);
    }
  }

  // Find children relationships
  const childRelationships = relationships.filter(rel => 
    rel.relationship_type === 'child' && rel.person1_id === rootMember.id
  );

  if (childRelationships.length > 0) {
    const childrenNode = {
      name: "Children",
      virtual: true,
      children: childRelationships.map(rel => {
        const child = members.find(m => m.id === rel.person2_id);
        if (!child) return null;
        return {
          name: `${child.first_name} ${child.last_name}`,
          gender: child.gender || 'unknown',
          id: child.id,
          relationship: 'child'
        };
      }).filter(Boolean)
    };
    
    if (childrenNode.children.length > 0) {
      processedData.children.push(childrenNode);
    }
  }

  // Find sibling relationships
  const siblingRelationships = relationships.filter(rel => 
    rel.relationship_type === 'sibling' && 
    (rel.person1_id === rootMember.id || rel.person2_id === rootMember.id)
  );

  if (siblingRelationships.length > 0) {
    const siblingsNode = {
      name: "Siblings",
      virtual: true,
      children: siblingRelationships.map(rel => {
        const siblingId = rel.person1_id === rootMember.id ? rel.person2_id : rel.person1_id;
        const sibling = members.find(m => m.id === siblingId);
        if (!sibling) return null;
        return {
          name: `${sibling.first_name} ${sibling.last_name}`,
          gender: sibling.gender || 'unknown',
          id: sibling.id,
          relationship: 'sibling'
        };
      }).filter(Boolean)
    };
    
    if (siblingsNode.children.length > 0) {
      processedData.children.push(siblingsNode);
    }
  }

  // Find parent relationships
  const parentRelationships = relationships.filter(rel => 
    rel.relationship_type === 'parent' && rel.person2_id === rootMember.id
  );

  if (parentRelationships.length > 0) {
    const parentsNode = {
      name: "Parents",
      virtual: true,
      children: parentRelationships.map(rel => {
        const parent = members.find(m => m.id === rel.person1_id);
        if (!parent) return null;
        return {
          name: `${parent.first_name} ${parent.last_name}`,
          gender: parent.gender || 'unknown',
          id: parent.id,
          relationship: 'parent'
        };
      }).filter(Boolean)
    };
    
    if (parentsNode.children.length > 0) {
      processedData.children.push(parentsNode);
    }
  }

  return processedData;
};
