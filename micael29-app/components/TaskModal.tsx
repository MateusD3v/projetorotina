import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TaskData } from '../services/ParseService';

interface TaskModalProps {
  visible: boolean;
  task?: TaskData | null;
  onSave: (task: TaskData) => void;
  onCancel: () => void;
}

export default function TaskModal({ visible, task, onSave, onCancel }: TaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    title: '',
    description: '',
    priority: 'Média',
    status: 'Pendente',
    units: '',
    deadline: 1,
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Média',
        status: 'Pendente',
        units: '',
        deadline: 1,
      });
    }
  }, [task, visible]);

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.units.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.deadline < 1) {
      Alert.alert('Erro', 'O prazo deve ser de pelo menos 1 dia.');
      return;
    }

    onSave(formData);
  };

  const updateField = (field: keyof TaskData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>
          
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => updateField('title', text)}
              placeholder="Digite o título da tarefa"
              placeholderTextColor="#95a5a6"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => updateField('description', text)}
              placeholder="Digite a descrição da tarefa"
              placeholderTextColor="#95a5a6"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.priority}
                onValueChange={(value) => updateField('priority', value)}
                style={styles.picker}
              >
                <Picker.Item label="Alta" value="Alta" />
                <Picker.Item label="Média" value="Média" />
                <Picker.Item label="Baixa" value="Baixa" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.status}
                onValueChange={(value) => updateField('status', value)}
                style={styles.picker}
              >
                <Picker.Item label="Pendente" value="Pendente" />
                <Picker.Item label="Em Andamento" value="Em Andamento" />
                <Picker.Item label="Concluído" value="Concluído" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Unidades *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                 selectedValue={formData.units}
                 onValueChange={(value) => updateField('units', value)}
                 style={styles.picker}
               >
                 <Picker.Item label="Selecione uma unidade" value="" />
                 <Picker.Item label="Alcindo Cacela" value="Alcindo Cacela" />
                 <Picker.Item label="Almirante Barroso" value="Almirante Barroso" />
                 <Picker.Item label="Augusto Montenegro" value="Augusto Montenegro" />
                 <Picker.Item label="Batista Campos" value="Batista Campos" />
                 <Picker.Item label="Conselheiro Furtado" value="Conselheiro Furtado" />
                 <Picker.Item label="Umarizal" value="Umarizal" />
                 <Picker.Item label="Três Corações" value="Três Corações" />
                 <Picker.Item label="Castanhal" value="Castanhal" />
               </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Prazo (dias)</Text>
            <TextInput
              style={styles.input}
              value={formData.deadline.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 1;
                updateField('deadline', num);
              }}
              placeholder="1"
              placeholderTextColor="#95a5a6"
              keyboardType="numeric"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cancelButton: {
    fontSize: 16,
    color: '#95a5a6',
  },
  saveButton: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
});