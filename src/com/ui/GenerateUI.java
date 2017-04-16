package com.ui;

import com.htmlutils.Main;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.Map;
import java.util.ResourceBundle;

/**
 * Created by vvishnoi on 4/16/17.
 */
public class GenerateUI {

    private static JTextArea sourceBrowseText;
    private static JTextArea destinationBrowseText;

    private static ResourceBundle bundle = ResourceBundle.getBundle("general");

    private static String sourceDirectoryName;
    private static String destDirectoryName;

    public static void main(String[] args) {
        final JFrame frame = new JFrame("SR Ticket HTML Parser");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setMinimumSize(new Dimension(600,200));
        frame.getContentPane().setBackground(new Color(255,255,255));
        JPanel controlPanel = new JPanel();
        frame.add(controlPanel);
        GridLayout layout = new GridLayout(0,2);
        layout.setHgap(20);
        layout.setVgap(20);
        controlPanel.setLayout(layout);
        //controlPanel.setBackground(new Color(255,255,255));
        sourceBrowseButton(controlPanel);
        destinationBrowseButton(controlPanel);
        generateAndCancelButton(controlPanel,frame);

        frame.pack();
        frame.show();

    }

    private static void sourceBrowseButton(JPanel controlPanel){
        //--------------------------------------------------------------------------------------------------------
        JPanel panel = new JPanel();

        sourceBrowseText = new JTextArea();
        sourceBrowseText.setLineWrap(true);
        sourceBrowseText.setEditable(false);
        sourceBrowseText.setOpaque(false);

        Button browseButton = new Button("Select Source Directory");
        browseButton.setForeground(new Color(105,105,105));

        browseButton.setBackground(new Color(255,255,240));
        browseButton.setSize(100, 10);
        panel.setLayout(new FlowLayout());

        panel.add(browseButton, BorderLayout.WEST);
        panel.add(sourceBrowseText, BorderLayout.WEST);
        controlPanel.add(panel);

        ActionListener listenerBrowseButton = new ActionListener() {
            public void actionPerformed(ActionEvent actionEvent) {
                try {
                    UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
                    File workingDirectory = new File(bundle.getString("SOURCE_FILES_PATH"));
                    JFileChooser jfc = new JFileChooser();
                    jfc.setCurrentDirectory(workingDirectory);
                    jfc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
                    int returnValue = jfc.showOpenDialog(null);
                    final File finalSelectedFile = jfc.getSelectedFile();
                    sourceDirectoryName = finalSelectedFile.getAbsolutePath();
                    sourceBrowseText.setText(sourceDirectoryName);
                }
                catch(Exception e){
                    e.printStackTrace();

                }
            }
        };
        browseButton.addActionListener(listenerBrowseButton);
        controlPanel.add(sourceBrowseText);
        sourceBrowseText.setText(sourceDirectoryName);
    }

    private static void destinationBrowseButton(JPanel controlPanel){
        JPanel panel = new JPanel();

        destinationBrowseText = new JTextArea();
        destinationBrowseText.setLineWrap(true);
        destinationBrowseText.setEditable(false);
        destinationBrowseText.setOpaque(false);

        Button browseButton = new Button("Select Destination Directory");
        browseButton.setForeground(new Color(105,105,105));
        browseButton.setBackground(new Color(255,255,240));
        browseButton.setSize(100, 8);
        panel.setLayout(new FlowLayout());

        panel.add(browseButton, BorderLayout.WEST);
        panel.add(destinationBrowseText, BorderLayout.WEST);
        controlPanel.add(panel);

        ActionListener listenerBrowseButton = new ActionListener() {
            public void actionPerformed(ActionEvent actionEvent) {
                try {
                    UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
                    File workingDirectory = new File(bundle.getString("DESCTINATION_FILES_PATH"));
                    JFileChooser jfc = new JFileChooser();
                    jfc.setCurrentDirectory(workingDirectory);
                    jfc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
                    int returnValue = jfc.showOpenDialog(null);
                    final File finalSelectedFile = jfc.getSelectedFile();
                    destDirectoryName = finalSelectedFile.getAbsolutePath();
                    destinationBrowseText.setText(destDirectoryName);
                }
                catch(Exception e){
                    e.printStackTrace();

                }
            }
        };
        browseButton.addActionListener(listenerBrowseButton);
        controlPanel.add(destinationBrowseText);
        destinationBrowseText.setText(destDirectoryName);
    }

    private static void generateAndCancelButton(JPanel controlPanel,final JFrame frame ){
        JButton generateReportButton = new JButton("Generate HTMLs");
        JLabel label=new JLabel();
        JButton cancelButton = new JButton("Cancel");
        ActionListener cancelListener = new ActionListener() {
            public void actionPerformed(ActionEvent actionEvent) {

                frame.dispose();
            }
        };
        cancelButton.addActionListener(cancelListener);
        ActionListener listener = new ActionListener() {
            public void actionPerformed(ActionEvent actionEvent) {
                try {

                        if(sourceDirectoryName==null || sourceDirectoryName.length()==0) {
                            JOptionPane.showMessageDialog(new JFrame(), "Please select Source Directory", "Error",
                                    JOptionPane.ERROR_MESSAGE);
                            return;
                        }
                        if(destDirectoryName==null || destDirectoryName.length()==0) {
                            JOptionPane.showMessageDialog(new JFrame(), "Please select Destination Directory", "Error",
                                    JOptionPane.ERROR_MESSAGE);
                            return;
                        }
                        Main.processDirectory(sourceDirectoryName,destDirectoryName);
                        controlPanel.remove(cancelButton);
                        controlPanel.add(label);
                        label.setText("Directory Processed Successfully");
                    }
                    catch(Exception e){

                        JOptionPane.showMessageDialog(new JFrame(), e.getMessage(), "Error",
                                JOptionPane.ERROR_MESSAGE);
                    }

                }

        };
        generateReportButton.addActionListener(listener);

      //  controlPanel.add(label);
        controlPanel.add(generateReportButton, BorderLayout.NORTH);

        controlPanel.add(cancelButton, BorderLayout.SOUTH);
    }

}
